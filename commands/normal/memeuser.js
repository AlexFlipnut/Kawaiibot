var request = require("request");

module.exports = {
	desc: "Make a meme from the mentioned user",
	usage: "<@user> | <top> | <bottom>",
	aliases: ['umeme'],
	cooldown: 3,
	task(bot, msg, suffix) {
		if (suffix && msg.mentions.length > 0) {
			let server = suffix.split('|')[0];
			let over = suffix.split('|')[1];
			let under = suffix.split('|')[2];
			suffix = suffix.substr(suffix.indexOf('|')).trim()
			suffix = suffix.replace("|", "").trim();
			if (server && over && under && suffix) {
				var url = `https://memegen.link/custom/${over}/${under}.jpg?alt=https://images.discordapp.net/avatars/${msg.mentions[0].id}/${msg.mentions[0].avatar}.png?size=512&font=impact`;
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
					bot.createMessage(msg.channel.id, '', {
						file: response.body,
						name: 'woop_meme.jpg'
					});
				});
			} else return 'wrong usage';
		} else return 'wrong usage';
	}
};
