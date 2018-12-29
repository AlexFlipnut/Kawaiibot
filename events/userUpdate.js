module.exports = async function(bot, settingsManager, _config, user, oldUser) {
	if (oldUser && user.username !== oldUser.username) {
		bot.guilds.forEach(guild => {
			if (guild.members.has(user.id)) {
				let nameEventChannel = await(settingsManager.getEventSetting(guild.id, 'namechanged'));
				if (nameEventChannel !== null)
					bot.createMessage(nameEventChannel, `\`[${new Date().toLocaleString()}]\` **Name Change:**\n\`\`${oldUser.username}\`\` is now \`\`${user.username}\`\``);
			}
		});
	}
}