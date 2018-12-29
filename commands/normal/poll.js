const moment = require('moment');

module.exports = {
	desc: "Creates a poll",
	usage: "<question> | <duration> [| emojis...]",
	cooldown: 2,
	task: async function (bot, msg, suffix) {
		if (!suffix)
			return 'wrong usage';
		let args = suffix.split(/ ?\| ?/);
		if (args.length < 2 && suffix.includes(','))
			args = suffix.split(/, ?/);
		args = args.filter(c => c !== ''); //Remove empty choices
		if (args.length < 1)
			return 'wrong usage';
		let choices = ['👍', '👎'];
		if (args.length >= 1) {
			if (!args[1]) args[1] = 60;
			if (args.length > 2) {
				choices = args[2].split(/ +/);
			}
			let time = parseInt(args[1]);
			if (isNaN(time)) {
				bot.createMessage(msg.channel.id, 'Invalid duration!');
				return;
			}
			time *= 1000;
			let message = `**__${args[0]}__**\n\nThe poll will expire ${moment.duration(time).humanize(true)}.\n\nVote here:`;

			let msg2 = await bot.createMessage(msg.channel.id, message);
			for (let choice of choices) {
				choice = choice.replace(/>/g, '').replace(/</g, '');
				try {
					await bot.addMessageReaction(msg2.channel.id, msg2.id, encodeURIComponent(choice));
				} catch (err) {
					//NO-OP
					//   logger.error(err);
				}
			}
			setTimeout(async function () {
				let msg3 = await(bot.getMessage(msg2.channel.id, msg2.id));
				let reactions = [];
				for (let key in msg3.reactions) {
					msg3.reactions[key].emoji = key;
					reactions.push(msg3.reactions[key]);
				}
				if (reactions.length == 0) {
					bot.createMessage(msg.channel.id, 'No results were collected!');
					return;
				}
				let totalVotes = 0;
				for (let key in reactions) {
					if (/\d/.test(reactions[key].emoji))
						reactions[key].emoji = `<:${reactions[key].emoji}>`;
					if (choices.indexOf(reactions[key].emoji) > -1)
						reactions[key].count--;
					totalVotes += reactions[key].count;
				}
				reactions.sort((a, b) => {
					return b.count - a.count;
				});
				let max = reactions[0].count;
				let winners = reactions.filter(r => r.count == max);
				let winnerString = winners.map(r => r.emoji).join(' ');
				if (winners.length > 1) {
					bot.createMessage(msg.channel.id, `**__${args[0]}__**\nThe results are in! It was a tie between these choices, at **${max}** vote${max == 1 ? '' : 's'} each:
${winnerString}

A total of **${totalVotes}** vote${totalVotes == 1 ? '' : 's'} were collected!`);
				} else {
					bot.createMessage(msg.channel.id, `**__${args[0]}__**\nThe results are in! At **${max}** vote${max == 1 ? '' : 's'}, the winner is:
${winnerString}

A total of **${totalVotes}** vote${totalVotes == 1 ? '' : 's'} were collected!`);
				}
			}, time);
		}
	}
};