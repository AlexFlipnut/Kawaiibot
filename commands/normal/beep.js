var Nf = new Intl.NumberFormat('en-US');

module.exports = {
	desc: "Responds with boop.",
	help: "Used to check if the bot is working.\nReplies with 'boop' and the response delay.",
	aliases: ['p'],
	cooldown: 2,
	task(bot, msg) {
		var boop = "boop"
		bot.createMessage(msg.channel.id, boop).then(sentMsg => {
			bot.editMessage(sentMsg.channel.id, sentMsg.id, `${boop}    |    Response delay: ${Nf.format(sentMsg.timestamp - msg.timestamp)}ms`);
		});
	}
};