module.exports = {
	desc: "Send a message to someone's ID",
	usage: "<userID> | <text>",
	hidden: true,
	ownerOnly: true,
	task(bot, msg, suffix) {
		if (suffix) {
			let server = suffix.split('|')[0].trim();
			suffix = suffix.substr(suffix.indexOf('|')).trim()
			suffix = suffix.replace("|", "").trim();
			bot.getDMChannel(server).then(pc => {
				bot.createMessage(pc.id, `**${msg.author.username}#${msg.author.discriminator}**\n${suffix}\n\nUse \`+reply\` to send a message back`);
			})
			bot.createMessage(msg.channel.id, "✅ | Message sent");
		} else return 'wrong usage';
	}
};