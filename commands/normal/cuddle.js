const request = require('superagent');
module.exports = {
	desc: "Cuddle a person",
	usage: "<@user>",
  cooldown: 5,
	async task(bot, msg) {
    if(msg.mentions.length === 1) {
      if(msg.author.id === msg.mentions[0].id) {
        msg.channel.createMessage(`Sorry to see you alone **${msg.author.username}**!`);
      }
      try {
      const url = await request.get('https://rra.ram.moe/i/r?type=cuddle')
      const image = await request.get(`https://rra.ram.moe${url.body.path}`)
      msg.channel.createMessage(`**${msg.mentions[0].username}**, you've been cuddled by **${msg.author.username}**`, {
        file: image.body, name:url.body.path.substring(url.body.path.lastIndexOf("/") + 1)
      })
    } catch(e) {
      return 'I could not complete the command ;-;'
    }
    }
    else {
      return 'Wrong usage'
    }
	}
};
