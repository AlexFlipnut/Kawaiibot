var Nf = new Intl.NumberFormat('en-US');

module.exports = {
	desc: "Roll a number between the given range.",
	usage: "[[min-]max]",
	cooldown: 2,
	aliases: ['random', 'dice'],
	task(bot, msg, suffix) {
		var quotes = [
			"Never gonna give you up", "Never gonna let you down", "Never gonna run around and desert you",
			"Never gonna make you cry", "Never gonna say goodbye", "Never gonna tell a lie and hurt you"
		];
		var rick_random = `${quotes[Math.floor(quotes.length * Math.random())]}`

		if (suffix == "rick") {
			bot.createMessage(msg.channel.id, `${rick_random}\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ`)
		} else {
			let args = suffix.match(/(?:(\d+)-)?(\d+)/);
			let roll = args === null ?
				[1, 10] :
				[parseInt(args[1]) || 1, parseInt(args[2])];
			bot.createMessage(msg.channel.id, `${msg.author.username} rolled **${Nf.format(roll[0])}-${Nf.format(roll[1])}** and got **${Nf.format(~~((Math.random() * (roll[1] - roll[0] + 1)) + roll[0]))}**`);
		}
	}
};