var Eris = require('eris');

module.exports = {
	desc: "Leak something (inserts lenny)",
	usage: "<text>",
	task(bot, msg, suffix) {
		if (!(msg.channel instanceof Eris.PrivateChannel)) {
			if (suffix) {
				bot.createMessage(msg.channel.id, `**${msg.author.username}** just leaked:\n${suffix}`);
			} else return 'wrong usage';
		} else return;
	}
}