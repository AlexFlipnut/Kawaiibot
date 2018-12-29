var request = require("request");

module.exports = {
	desc: "Gives you a random, lovely cat",
	cooldown: 5,
	task(bot, msg) {
		request.get("http://random.cat/meow", function (err, res) {
			var cat = JSON.parse(res.body)
			bot.createMessage(msg.channel.id, cat.file)
		});
	}
};