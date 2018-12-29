module.exports = {
	desc: "Get an invite to KawaiiBot server",
	aliases: ['home'],
	task(bot, msg) {
		msg.channel.createMessage(`Here you go **${msg.author.username}** 🎀\n**<https://discord.gg/kawaii>**`)
	}
};
