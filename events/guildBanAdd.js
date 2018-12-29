module.exports = async function(bot, settingsManager, _config, guild, user) {
	let banEventChannel = await(settingsManager.getEventSetting(guild.id, 'userbanned'));
	if (banEventChannel !== null)
		bot.createMessage(banEventChannel, { content: '',
			embed: {
					color: 0xE74C3C,
					description: `🔨 **User Banned:** ${user.username}#${user.discriminator} (${user.id})`
			}
		});
}
