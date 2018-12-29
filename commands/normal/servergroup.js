var Jimp = require('jimp')

module.exports = {
	desc: "Makes a picture with the server avatar surrounded with random user icons",
	usage: "",
	cooldown: 15,
	task(bot, msg) {
		/*i have spagethi code pls don't judge me*/
		if (msg.channel.guild.members.size >= 12) {
			bot.sendChannelTyping(msg.channel.id)
			var memberarray = msg.channel.guild.members.map(g => g);
			var imgs = []
			imgs.push(Jimp.read(msg.channel.guild.iconURL));
			for (let i = 0; i < 12; i++) {
				imgs.push(Jimp.read(memberarray[getRandomInt(0, memberarray.length)].user.avatarURL));
			}
			imgs.push(Jimp.read("special/img.png"));
			Promise.all(imgs).then(function (images) {
				var bg = images[13];
				var guildicon = images[0];
				var user1 = images[1];
				var user2 = images[2];
				var user3 = images[3];
				var user4 = images[4];
				var user5 = images[5];
				var user6 = images[6];
				var user7 = images[7];
				var user8 = images[8];
				var user9 = images[9];
				var user10 = images[10];
				var user11 = images[11];
				var user12 = images[12];
				guildicon.resize(256, 256);
				user1.resize(128, 128);
				user2.resize(128, 128);
				user3.resize(128, 128);
				user4.resize(128, 128);
				user5.resize(128, 128);
				user6.resize(128, 128);
				user7.resize(128, 128);
				user8.resize(128, 128);
				user9.resize(128, 128);
				user10.resize(128, 128);
				user11.resize(128, 128);
				user12.resize(128, 128);
				bg.clone()
					.blit(guildicon, 128, 128)
					.blit(user1, 0, 0)
					.blit(user2, 0, 128)
					.blit(user3, 0, 258)
					.blit(user4, 0, 384)
					.blit(user5, 128, 0)
					.blit(user6, 128, 384)
					.blit(user7, 256, 0)
					.blit(user8, 256, 384)
					.blit(user9, 384, 0)
					.blit(user10, 384, 128)
					.blit(user11, 384, 256)
					.blit(user12, 384, 384)
					.getBuffer(Jimp.MIME_PNG, function (err, buffer) {
						bot.createMessage(msg.channel.id, "Here's some random users!", {
							"file": buffer,
							"name": "woop.png"
						})
					});
			}).catch(function (err) {
				console.error(err.stack);
			});
		} else {
			bot.createMessage(msg.channel.id, "Sorry, Your server is too small to have a member mosaic")
		}

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}
};