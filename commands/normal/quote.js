module.exports = {
	desc: "Make a fake/real quote",
	usage: "<quote> | <author>",
	task(bot, msg, suffix) {
		if (suffix) {
			let quote = suffix.split('|')[0].trim();
			suffix = suffix.substr(suffix.indexOf('|')).trim()
			suffix = suffix.replace("|", "").trim();
			if (suffix && quote) {
        bot.createMessage(msg.channel.id, { content: ``,
          embed: {
              color: 0x2196F3,
              author: {
                name: `${suffix} once said...`,
                icon_url: ''
              },
              description: `"${quote}"`,
              footer: {
                icon_url: `${msg.author.avatarURL}`,
                text: `${msg.author.username}#${msg.author.discriminator} created this quote`
              }
            }
        });
			} else return 'wrong usage';
		} else return 'wrong usage';
	}
};
