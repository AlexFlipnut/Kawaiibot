var blacklist = [
	"267521171623247872", "218527319193550849", "140630226358108160",
	"183402019745300480", "87247023710937088", "215559979908726784",
	"176332222977146880", "169084674272919554", "269935361038352384",
	"135476058819526656", "170316857834733568", "153338875652079617",
	"234052622653456385", "86306032183148544", "221377376624312321",
	"158354069662990337"
]

module.exports = {
	desc: "Send a feedback to my master, AlexFlipnote <3",
	usage: "<text>",
	cooldown: "300",
	guildOnly: true,
	task(bot, msg, suffix) {
		if (blacklist.includes(msg.author.id))
			return msg.channel.createMessage(`⚠ Access Denied!\nYou are blacklisted and can't do this command **${msg.author.username}**`);
		if (!suffix)
			return 'wrong usage';

		bot.createMessage("228158846571380743", { content: ``,
			embed: {
					color: 0x2196F3,
					author: {
							name: `${msg.author.username}#${msg.author.discriminator} | ${msg.author.id}`
					},
					thumbnail: {
						url: msg.author.avatarURL
					},
					fields: [
						{name: 'Server', value: `${msg.channel.guild.name}\n(${msg.channel.guild.id})`, inline: true},
						{name: 'Server Channel', value: `#${msg.channel.name}\n(${msg.channel.id})`, inline: true},
						{name: 'Message', value: `${suffix}`, inline: false},
					]
				}
		})
		.then(() => { msg.channel.createMessage(`Thank you for your feedback **${msg.author.username}** !\nRemember, people read this, so don't spam it.`) })
	}
};
