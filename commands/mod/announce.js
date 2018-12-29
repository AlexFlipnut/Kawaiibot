module.exports = {
	desc: "Makes an announcement on the KawaiiBot server",
	usage: "<announcement>",
	hidden: true,
	aliases: ['update'],
	requiredPermission: 'banMembers',
	task(bot, msg, suffix) {
		function getDateTime() {
			var date = new Date(); var year = date.getFullYear(); var month = date.getMonth() + 1;
			month = (month < 10 ? "0" : "") + month; var day = date.getDate(); day = (day < 10 ? "0" : "") + day;
			return day + "/" + month + "/" + year;
		}

		function announcement_template() {
			bot.createMessage(channel, { content: `ℹ **Announcement [${getDateTime()}]**`,
				embed: {
						color: 0x2196F3,
						description: `${suffix}`,
						footer: {
							icon_url: `${msg.author.avatarURL}`,
							text: `${msg.author.username}#${msg.author.discriminator}`
						}
				}
			});
			bot.createMessage(msg.channel.id, `Posted, check <#${channel}> to be sure it posted!`);
		}

		if (suffix) {
			if (msg.channel.guild.id == "226959018722066432") { //KawaiiBot / Bytr Hangout
				var channel = "226967703326425089"; announcement_template();
			} else bot.createMessage(msg.channel.id, `This server is not whitelisted... ask AlexFlipnote for permission!`)
		} else return 'wrong usage';
	}
};
