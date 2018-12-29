module.exports = {
	desc: "The link to add me to a server.",
	aliases: ['oauth', 'join', 'j'],
	cooldown: 5,
	task(bot, msg, _, config) {
		bot.createMessage(msg.channel.id, `${msg.author.username}-senpai, please bring me to your server ❤\n<https://discordapp.com/oauth2/authorize?client_id=195244341038546948&scope=bot>`);
	}
};
