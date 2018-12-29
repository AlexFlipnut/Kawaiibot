var Jimp = require('jimp')

module.exports = {
	desc: "Ships 2 people",
	usage: "<@user1> <@user2>",
	cooldown: 15,
	aliases: [],
	task(bot, msg) {
		if (msg.mentions.length == 1 && msg.author.id == msg.mentions[0].id ) {
			bot.createMessage(msg.channel.id, `Lovely shi... Alone? Don't be like that ${msg.author.username} ;-; *hugs you*`);
		} else if (!(msg.mentions.length < 2 || msg.mentions.length > 2)) {
			bot.sendChannelTyping(msg.channel.id)
			let firstPart = msg.mentions[0].username.substring(0, msg.mentions[0].username.length / 2);
			let lastPart = msg.mentions[1].username.substring(msg.mentions[1].username.length / 2);
			var imgs = []
			imgs.push(Jimp.read("./special/ship.png"));
			imgs.push(Jimp.read(`https://images.discordapp.net/avatars/${msg.mentions[0].id}/${msg.mentions[0].avatar}.png?size=1024`))
			imgs.push(Jimp.read(`https://images.discordapp.net/avatars/${msg.mentions[1].id}/${msg.mentions[1].avatar}.png?size=1024`))
			Promise.all(imgs).then(function (images) {
				var bg = images[0];
				var user1 = images[2];
				var user2 = images[1];
				user1.resize(128, 128);
				user2.resize(128, 128);
				bg.clone()
					.blit(user1, 0, 0)
					.blit(user2, 256, 0)
					.getBuffer(Jimp.MIME_PNG, function (err, buffer) {
						bot.createMessage(msg.channel.id, `Lovely shipping~\nShip name: **${firstPart}${lastPart}**`, {
							"file": buffer,
							"name": "ship.png"
						})
					});
			}).catch(function (err) {
				console.error(err.stack);
			});
		} else {
			return 'wrong usage';
		}
	}
};
