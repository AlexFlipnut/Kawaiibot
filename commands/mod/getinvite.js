module.exports = {
	desc: "Gets an invite to a server.",
	usage: "<URL>",
	hidden: true,
	ownerOnly: true,
	aliases: ["getinv"],
	task(bot, msg, suffix) {
		let server = bot.guilds.filter(m => m.name == suffix || m.id == suffix);
		bot.createChannelInvite(server[0].defaultChannel.id)
			.then((invite) => {	msg.channel.createMessage(`https://discord.gg/${invite.code}`) })
	}
}
