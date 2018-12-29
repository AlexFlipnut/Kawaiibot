module.exports = {
	desc: "Rates what you desire or your waifu <3",
	usage: "<something> --custom <NUMBERS>",
	cooldown: 5,
	aliases: ['rate'],
	task(bot, msg, suffix) {
		/** CODE:NOTE These variable names please D: */
		let le_custom_detector = suffix.indexOf("--custom"),
			the_random;
		if (suffix && le_custom_detector != -1) {
			var split = suffix.split('--custom')[1],
				rateing = suffix.split('--custom')[0],
				after_custom = split;
			the_random = (Math.random() * after_custom + 1).toFixed(0);

			suffix = suffix.substr(suffix.indexOf('--custom')).trim()
			suffix = suffix.substr(suffix.indexOf(after_custom)).trim()

			if (the_random == "NaN") {
				bot.createMessage(msg.channel.id, `Your choice of \`${after_custom}\` as a value is invalid, please only use numbers`)
			} else bot.createMessage(msg.channel.id, `I'd rate ${rateing}a **${the_random} /${after_custom}**`);

		} else if (suffix) {
			the_random = (Math.random() * 98 + 1).toFixed(2);
			bot.createMessage(msg.channel.id, `I'd rate ${suffix} a **${the_random} / 100**`);
		} else return 'wrong usage';
	}
};