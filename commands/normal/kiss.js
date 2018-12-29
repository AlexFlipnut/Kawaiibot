var request = require("request");

module.exports = {
	desc: "Poke someone for the lolz",
	usage: "<@user>",
	cooldown: 5,
	task(bot, msg) {
		if (msg.mentions.length === 1) {
			if (msg.author.id == msg.mentions[0].id) {

				bot.sendChannelTyping(msg.channel.id);
				request({ url: "http://i.imgbox.com/y5W58mmr.gif", encoding: null }, (err, response) => {
					if (err) {
						bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {"wait": 8000});
						}); return;
					}
					if (response.statusCode != 200) {
						bot.createMessage(msg.channel.id, "Got status code " + response.statusCode, function (erro, wMessage) {
							bot.deleteMessages(wMessage, { "wait": 8000 });
						}); return;
					}
					bot.createMessage(msg.channel.id, `Sorry to see you alone **${msg.author.username}** have a pillow.. ;-;`, {
						file: response.body, name: 'alone.gif'
					});
				});

			} else if (msg.mentions[0].id == bot.user.id) {
				if (msg.author.id == "86477779717066752") {
					bot.createMessage(msg.channel.id, `*kisses master ${msg.author.username} back* :heart:`);
				} else bot.createMessage(msg.channel.id, `uhm.. I'm not single, sorry ;-;`);
			} else {
				bot.sendChannelTyping(msg.channel.id);
				var gifs = [
					"https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif",
          "https://66.media.tumblr.com/d07fcdd5deb9d2cf1c8c44ffad04e274/tumblr_n2oqnslDSm1tv44eho1_500.gif",
          "https://media.giphy.com/media/12VXIxKaIEarL2/giphy.gif",
          "http://68.media.tumblr.com/05ce0bdeb2cf6a99285cf61430964f08/tumblr_n75ji8OGDf1tzpao0o1_400.gif",
          "https://66.media.tumblr.com/bb5f4cac6a92a5e61e580c696656550f/tumblr_n00skakLEk1rveihgo1_500.gif",
          "https://media.giphy.com/media/sS7Jac8n7L3Ve/giphy.gif",
          "https://66.media.tumblr.com/10bcb6c9307fc559e9d7fc45046c76d0/tumblr_n0nr61iCl31rw7ngmo1_500.gif",
					"https://31.media.tumblr.com/134272ec206fa90ac500f158ebea07b4/tumblr_n2eq50zsCB1qbvovho7_500.gif",
          "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
					"https://im1.ibsear.ch/b/02/8657a6eec7d337629a941d75608f0.gif",
					"https://im1.ibsear.ch/0/81/f50be74b811194d7f476732f4c96b.gif"
				];
				var url = `${gifs[Math.floor(gifs.length * Math.random())]}`
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
					bot.createMessage(msg.channel.id, `**${msg.mentions[0].username}**, you got a kiss from **${msg.author.username}**`, {
						file: response.body,
						name: 'kiss.gif'
					});
				});
			}
		} else return 'wrong usage';
	}
};
