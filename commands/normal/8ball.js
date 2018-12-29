module.exports = {
	desc: "What does 8ball think about your question?",
	usage: "<text>",
	task(bot, msg, suffix) {
		var responses = [
			"Yes", "No", "Take a wild guess...", "Very doubtful",
			"Sure", "Without a doubt", "Most likely", "Might be possible",
			"You'll be the judge", "no... (╯°□°）╯︵ ┻━┻", "no... baka",
			"senpai, pls no ;-;"
		];
		if (suffix) {
			bot.createMessage(msg.channel.id, `🎱 **Question:** ${suffix}\n**Answer:** ${responses[Math.floor(Math.random() * (responses.length))]}`);
		} else return 'wrong usage';
	}
};