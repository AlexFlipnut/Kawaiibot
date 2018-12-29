var remind = require('../../utils/remind.js');

function timeParser(amount, mod) {
	switch (amount) {
	case "a":
	case "an":
	case "one":
	case "1": //js pls
		return 1 * mod;
	case "two":
	case "2":
		return 2 * mod;
	case "three":
	case "3":
		return 3 * mod;
	default:
		return parseInt(amount) * mod;
	}
}

module.exports = {
	desc: "Set reminders.",
	usage: "<reminder> in <[0 days] [00 hours] [00 minutes] [000 seconds]> | remove <text in reminder> | list",
	help: "__remove:__ Will remove a reminder containing the text input.\n__list:__ List your reminders.\n__add:__ Use the *<text> in <[0 days] [00 hours] [00 minutes] [000 seconds]>*  format.\n(Huge thanks to Brayzure#9406 for help with rewrite)",
	aliases: ['remind'],
	cooldown: 5,
	task(bot, msg, suffix, config) {
		if (/^remove/i.test(suffix)) {

			if (suffix.length > 7) {
				remind.removeReminder(suffix.replace(/^remove /i, ''), msg.author.id, () => {
					bot.createMessage(msg.channel.id, "Successfully removed reminder 👍");
				}, () => {
					bot.createMessage(msg.channel.id, "No matching reminder found 👎");
				});
			} else {
				let list = remind.listForUser(msg.author.id);
				if (list && list.length > 0) bot.createMessage(msg.channel.id, "__Use `" + config.command_prefix + "remindme remove ` + the text from the reminder you wish to remove:__\n" + list.join('\n'));
				else bot.createMessage(msg.channel.id, "Looks like you don't have any reminders!");
			}

		} else if (suffix.toLowerCase() === 'list') {

			let list = remind.listForUser(msg.author.id);
			if (list && list.length > 0) bot.createMessage(msg.channel.id, "__Here are your reminders:__\n" + list.join('\n'));
			else bot.createMessage(msg.channel.id, "Looks like you don't have any reminders!");

		} else if (/^.* in( ((\d\d?\d?|a|one|two|three) ?d[ays]*)( and| &|,)?)?( ((\d\d?\d?|a|an|one|two|three) ?h[ours]*)( and| &|,)?)?( ((\d\d?\d?|a|one|two|three) ?m[inutes]*)( and| &|,)?)?( (\d\d?\d?|a|one|two|three) ?s[econds]*)?$/i.test(suffix)) {

			if (remind.countForUser(msg.author.id) >= 5) {
				bot.createMessage(msg.channel.id, "You can't add any more reminders because you already have 5. You can remove a reminder to make space with `" + config.command_prefix + "remindme remove <text>`");
				return;
			}

			let millisecs = 0,
				timeString = suffix.replace(/.* in /i, '');
			if (/ ((\d\d?\d?\d?\d?|a|one|two|three) ?s[econds]*)$/i.test(suffix)) {
				millisecs += timeParser(/((\d\d?\d?\d?\d?|a|one|two|three) ?s[econds]*)$/i.exec(suffix)[2] + "", 1000);
				suffix = suffix.replace(/( and| &|,)? ((\d\d?\d?\d?\d?|a|one|two|three) ?s[econds]*)$/i, '');
			}
			if (/ ((\d\d?\d?|a|one|two|three) ?m[inutes]*)$/i.test(suffix)) {
				millisecs += timeParser(/((\d\d?\d?|a|one|two|three) ?m[inutes]*)$/i.exec(suffix)[2] + "", 60000);
				suffix = suffix.replace(/( and| &|,)? ((\d\d?\d?|a|one|two|three) ?m[inutes]*)$/i, '');
			}
			if (/ ((\d\d?\d?|a|an|one|two|three) ?h[ours]*)$/i.test(suffix)) {
				millisecs += timeParser(/((\d\d?\d?|a|an|one|two|three) ?h[ours]*)$/i.exec(suffix)[2] + "", 3600000);
				suffix = suffix.replace(/( and| &|,)? ((\d\d?\d?|a|an|one|two|three) ?h[ours]*)$/i, '');
			}
			if (/ ((\d\d?\d?|a|one|two|three) ?d[ays]*)$/i.test(suffix)) {
				let hours = /((\d\d?\d?|a|one|two|three) ?d[ays]*)$/i.exec(suffix)[2];
				if (/\d\d\d?/.test(hours)) {
					if (hours > 14) {
						bot.createMessage(msg.channel.id, "There is a 14 day limit on reminders", (e, m) => {
							bot.deleteMessage(m, {
								"wait": 10000
							});
						});
						return;
					}
				}
				millisecs += timeParser(hours + "", 86400000);
				suffix = suffix.replace(/( and| &|,)? ((\d|a|one|two|three) ?d[ays]*)$/i, '');
			}
			if (millisecs > 1209600000) {
				bot.createMessage(msg.channel.id, "There is a 14 day limit on reminders", (e, m) => {
					bot.deleteMessage(m, {
						"wait": 10000
					});
				});
				return;
			} else if (millisecs <= 0) {
				bot.createMessage(msg.channel.id, "You must specify a time in the future", (e, m) => {
					bot.deleteMessage(m, {
						"wait": 10000
					});
				});
				return;
			}

			let reminder = suffix.replace(/^(me )?(to )?/i, '').replace(/in ?$/i, '').trim();
			remind.addReminder(msg.author.id, Date.now() + millisecs, reminder);
			bot.createMessage(msg.channel.id, "⏰ Alright **" + msg.author.username + "-senpai** I'll remind you with a PM in " + timeString);

		} else return 'wrong usage';
	}
}
