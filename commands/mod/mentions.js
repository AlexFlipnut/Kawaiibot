module.exports = {
  desc: "Checks the recent mentions on you",
  guildOnly: true,
  task(bot, msg, suffix) {
    let messageCount = 1500;
    bot.sendChannelTyping(msg.channel.id);
    bot.getMessages(msg.channel.id, messageCount).then(messages => {
      let mentioned = messages.filter(o => ~o.mentions.indexOf(msg.author));
      // mentioned is the array of messages that mention author
      // console.log(mentioned)
      if (!mentioned.length) return msg.channel.createMessage(`No mentions found in the past ${messageCount} messages **${msg.author.username}** ;-;`);
      let m = "";
      for (const mention of mentioned) {
        m += `${mention.author?mention.author.username:"Unknown User"}: ${mention.cleanContent.slice(0, 150)}\n`;
      }
      msg.author.getDMChannel().then(channel => channel.createMessage(m));
      bot.createMessage(msg.channel.id, `📥 Sent all mentions I could find in ${messageCount} messages, **${msg.author.username}**`);
    }).catch(e => {
      bot.createMessage(msg.channel.id, `There was an error: ${e}`);
    });
  }
};
