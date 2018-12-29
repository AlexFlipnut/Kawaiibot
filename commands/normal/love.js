var request = require("request");

module.exports = {
	desc: "???",
	aliases: ['alexflipnote', 'dylan'],
  hidden: true,
	cooldown: 2,
	task(bot, msg) {
    var url = "http://kawaiibot.cf/images/love.png";
    request({
      url: url,
      encoding: null
    }, (err, response) => {
      if (err) {
        bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
          bot.deleteMessages(wMessage, {
            "wait": 8000
          });
        });
        return;
      }
      if (response.statusCode != 200) {
        bot.createMessage(msg.channel.id, "Got status code " + response.statusCode, function (erro, wMessage) {
          bot.deleteMessages(wMessage, {
            "wait": 8000
          });
        });
        return;
      }
      bot.createMessage(msg.channel.id, '💜 + 💙', {
        file: response.body,
        name: 'love.png'
      });
  });
	}
};
