module.exports = {
	desc: "Make text in Fullwidth",
	usage: "<text>",
	task(bot, msg, suffix) {
		if (suffix) {
			bot.createMessage(msg.channel.id, suffix.replace(/[a-zA-Z0-9!\?\.'";:\]\[}{\)\(@#\$%\^&\*\-_=\+`~><]/g,
				(c) => String.fromCharCode(0xFEE0 + c.charCodeAt(0))).replace(/ /g, '　'));
		} else return 'wrong usage';
	}
}