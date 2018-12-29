module.exports = {
	desc: "Flip a coin",
	aliases: ['flip', 'coin'],
	task(bot, msg) {
		if (Math.floor(Math.random() * (2)) == 0) bot.createMessage(msg.channel.id, `**${msg.author.username}** flipped a coin and got **Heads**`);
		else bot.createMessage(msg.channel.id, `**${msg.author.username}** flipped a coin and got **Tails**`);
	}
};