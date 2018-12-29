module.exports = {
	desc: "Gives you a colour preview with HEX format (Without #)",
	usage: "<HEX>",
	aliases: ['colour'],
	task(bot, msg, suffix) {
		if (suffix) {
			if (suffix.indexOf("#") == 0) return 'wrong usage';
			bot.createMessage(msg.channel.id, { content: undefined,
        embed: {
            description: `**Colour:** #${suffix}`,
            thumbnail: {
              url: `https://projects.festive.tf/color/?color=${suffix}`
            },
        }
      });
		} else return 'wrong usage';
	}
}
