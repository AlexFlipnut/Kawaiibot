module.exports = {
	desc: "+woop",
	usage: "<text>",
	task(bot, msg) {
		bot.createMessage(msg.channel.id, `https://media.giphy.com/media/4SGFq4W8Zx36U/giphy.gif`)
	}
};