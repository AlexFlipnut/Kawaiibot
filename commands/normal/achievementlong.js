var request = require("request");

module.exports = {
	desc: "Get an achievement like Minecraft (Long version)",
	usage: "<text> [&h=TITLE]",
	aliases: ['ahl'],
	task(bot, msg, suffix) {
		if (suffix) {
			function randomNumber(minimum, maximum) {
				return Math.round(Math.random() * (maximum - minimum) + minimum);
			}
			var url = "https://api.thegathering.xyz/minecraft/?i=" + randomNumber(40, 78) + "&h=Achievement+Get!&t=" + suffix;
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
					name: 'gratz.png'
				});
			});
		} else return 'wrong usage';
	}
};
