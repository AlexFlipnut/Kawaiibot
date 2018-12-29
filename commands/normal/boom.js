module.exports = {
	desc: "A lovely dog watching the lights go 'boom'",
	usage: "",
	task(bot, msg) {
		bot.createMessage(msg.channel.id, "https://giphy.com/gifs/computer-gZBYbXHtVcYKs");
	}
};