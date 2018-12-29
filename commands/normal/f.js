var counter = 0;

module.exports = {
	desc: "Press F to pay respect",
	usage: "[stats]",
	task(bot, msg, suffix) {
		var hearts = ["❤", "💛", "💚", "💙", "💜"];
		var randomHearts = `${hearts[Math.floor(hearts.length * Math.random())]}`

		if (suffix) {
			if (suffix == "stats") {
				bot.createMessage(msg.channel.id, `**${counter}** have paid their respects today ${randomHearts}`);
			} else {
				bot.createMessage(msg.channel.id, `**${msg.author.username}** have paid their respects for **${suffix}** ${randomHearts}`);
				counter++
			}
		} else {
			bot.createMessage(msg.channel.id, `**${msg.author.username}** have paid their respects ${randomHearts}`);
			counter++
		}
	}
};
