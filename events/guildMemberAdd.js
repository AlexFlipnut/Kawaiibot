module.exports = async function(bot, settingsManager, _config, guild, member) {
	let welcomeMessage = await(settingsManager.getWelcome(guild, member));
	if (welcomeMessage !== null) {
		if (welcomeMessage[0] === 'DM') {
			member.user.getDMChannel().then(chan => {
				chan.createMessage(welcomeMessage[1]);
			});
		} else
			bot.createMessage(welcomeMessage[0], welcomeMessage[1]);
	}

	let joinEventChannel = await(settingsManager.getEventSetting(guild.id, 'memberjoined'));
	if (joinEventChannel !== null)
		bot.createMessage(joinEventChannel, { content: '',
			embed: {
					color: 0x2ECC71,
					description: `📥 **User Joined** \`[${new Date().toLocaleString()}]\`
<@!${member.user.id}> | ${member.user.username}#${member.user.discriminator} (${member.user.id})

**User created:**
${new Date((member.user.id / 4194304) + 1420070400000).toUTCString()}`
			}
		});
}
