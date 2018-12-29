var request = require("request");

module.exports = {
	desc: "Make a meme from a picture URL (Bot should have permission to delete messages)",
	usage: "<URL to image> | <top> | <bottom>",
	aliases: ['mmeme'],
	cooldown: 3,
	task(bot, msg, suffix) {
		let server = suffix.split('|')[0];
		let over = suffix.split('|')[1];
		let under = suffix.split('|')[2];
		suffix = suffix.substr(suffix.indexOf('|')).trim()
		suffix = suffix.replace("|", "").trim();
		if (server && over && under && suffix) {
			var url = `https://memegen.link/custom/${over}/${under}.jpg?alt=${server}`;
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
				bot.deleteMessage(msg.channel.id, msg.id).catch();
			});
		} else return 'wrong usage';
	}
};
