var fs = require('fs'),
  reminders = require('../db/reminders.json'),
  updatedR = false;
/*
setInterval(() => {
  if (updatedR) {
    updatedR = false;
    updateRemindDB();
  }
}, 60000)


function updateRemindDB() {
  fs.writeFile(__dirname + '/../db/reminders-temp.json', JSON.stringify(reminders), error => {
    if (error) console.log(error)
    else {
      fs.stat(__dirname + '/../db/reminders-temp.json', (err, stats) => {
        if (err) console.error(err.stack)
        else if (stats["size"] < 2) console.log('Prevented reminders database from being overwritten');
        else {
          fs.rename(__dirname + '/../db/reminders-temp.json', __dirname + '/../db/reminders.json', e => {
            if (e) console.log(e)
          });
          console.log("DEBUG Updated reminders.json");
        }
      });
    }
  })
}
*/

exports.reminders = reminders;

/*
Add Reminder:
  user: A user's ID
  date: The date in milliseconds
  text: The reminder to be sent
*/
exports.addReminder = async function (user, date, text) {
  if (!user || !date || !text) return;
  return await(r.table('reminders').insert({
    timestamp: r.epochTime(date / 1000),
    userId: user,
    text: text
  }).run());
};

exports.countForUser = async function (user) {
  return await(r.table('reminders').getAll(user, {
    index: 'userId'
  }).count().run());
};

exports.listForUser = async function (user) {
  return await(r.table('reminders').getAll(user, {
    index: 'userId'
  }).run());
};

exports.checkReminders = async function (bot) {
  if (bot.shards.values().next().value.id !== 0) return;
  let list = await(r.table('reminders').between(r.epochTime(0), r.now(), { index: 'timestamp' }).run());
  for (let i = 0; i < list.length; i++) {
    var recipient = bot.users.get(list[i].userId);
    if (recipient) {
      let dmChannel = await(bot.getDMChannel(recipient.id))
      await(bot.createMessage(dmChannel.id, `⏰ **Reminder:**\n${list[i].text}`))
      // console.log("Sent reminder");
      await(r.table('reminders').get(list[i].id).delete().run());
    }
  }
};

/*
Remove Reminder:
  user: A user's ID
  text: The reminder to be removed
  success: function to run on completion
  fail: function to run if not found
*/
exports.removeReminder = async function (text, user, success, fail) {
  if (!text || !user) return;
  var list = await(r.table('reminders').getAll(user, {
    index: 'userId'
  }).filter(function (reminder) {
    return reminder('text').match(text);
  }).run());
  var found = false;
  if (list.length > 0) {
    found = true;
    await(r.table('reminders').get(list[0].id).delete().run());
  }
  if (found && typeof success == 'function') success();
  else if (!found && typeof fail == 'function') fail();
};
