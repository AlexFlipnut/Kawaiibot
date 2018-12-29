module.exports = {
	desc: "Gives you a random, lovely penguin",
	cooldown: 5,
	task(bot, msg) {
		bot.createMessage(msg.channel.id, `http://penguin.wtf/images/${Math.floor(Math.random() * 26) + 1  }.png`)
	}
};