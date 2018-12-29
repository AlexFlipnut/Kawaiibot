var Eris = require('eris');

module.exports = {
	desc: "Send a message to my master, AlexFlipnote <3",
	usage: "<text>",
	cooldown: "10",
	hidden: true,
	task(bot, msg, suffix) {
		if ((msg.channel instanceof Eris.PrivateChannel)) {
			if (suffix) {
				let feedback_channel = "228158846571380743";
				bot.createMessage(feedback_channel, `**${msg.author.username}#${msg.author.discriminator}** (${msg.author.id})\n${suffix}`);
				bot.createMessage(msg.channel.id, "✅ | Message sent");
			} else return 'wrong usage';
		} else return;
	}
};