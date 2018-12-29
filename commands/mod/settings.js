//Validates the message and updates the setting.
var updateWelcome = async function (bot, msg, suffix, settingsManager) {
			if (suffix.toLowerCase() === 'disable') {
				settingsManager.setWelcome(msg.channel.guild.id)
					.then(() => bot.createMessage(msg.channel.id, '⚙ Welcome message disabled'));
			} else if (suffix.toLowerCase() === 'check') {
				let settings = await (settingsManager.getWelcome(msg.channel.guild, undefined, true));
				bot.createMessage(msg.channel.id, settings === null ?
						'You do not have a welcome message set.' :
						`**Current welcome message:**\nChannel: ${settings[0] === 'DM' ? 'DM' : `<#${settings[0]}>`}\nMessage: ${settings[1]}`);
	} else {
		let newWelcome = suffix.replace(/(<#[0-9]+>|DM)/i, '').trim();
		if (suffix === '')
			bot.createMessage(msg.channel.id, 'Please format your message in this format: `welcome <#channel | DM> <message>`');
		else if (msg.channelMentions.length === 0 && !suffix.toLowerCase().startsWith('dm'))
			bot.createMessage(msg.channel.id, 'Please specify a channel to send the welcome message to.');
		else if (!newWelcome)
			bot.createMessage(msg.channel.id, 'Please specify a welcome message.');
		else if (newWelcome.length >= 1900)
			bot.createMessage(msg.channel.id, "Sorry, your welcome message needs to be under 1,900 characters.");
		else {
			settingsManager.setWelcome(msg.channel.guild.id, suffix.toLowerCase().startsWith('dm') ? 'DM' : msg.channelMentions[0], newWelcome)
				.then(() => bot.createMessage(msg.channel.id, `⚙ Welcome message set to:\n${newWelcome} **in** ${suffix.toLowerCase().startsWith('dm') ? 'a DM' : '<#' + msg.channelMentions[0] + '>'}`));
		}
	}
}

var handleEventsChange = async function(bot, msg, suffix, settingsManager) {
	if (suffix.toLowerCase() === 'disable') {
		settingsManager.setEventChannel(msg.channel.guild.id);
		bot.createMessage(msg.channel.id, '⚙ Events disabled');
	} else if (suffix.toLowerCase() === 'check') {
		let settings = await(settingsManager.getGuildsEvents(msg.channel.guild.id));
		bot.createMessage(msg.channel.id, settings === null ? 'You do not have event logging enabled.' : `**Event settings for this server**
Channel: <#${settings.channelId}>
${settingsManager.eventList.map(e => `${e}: ${settings.subbed.includes(e) === true ? 'subscribed' : 'not subscribed'}`).join('\n')}`);
	} else {
		if (msg.channelMentions.length > 0) {
			settingsManager.setEventChannel(msg.channel.guild.id, msg.channelMentions[0]);
			bot.createMessage(msg.channel.id, `⚙ Events will be posted in <#${msg.channelMentions[0]}> now`);
		}
		if (/\+[^ ]/.test(suffix)) {
			settingsManager.subEvents(suffix.match(/(\+[^ ]+)/g), msg.channel)
				.then(events => { bot.createMessage(msg.channel.id, `Subscribed to: \`${events.join('` `')}\``); })
				.catch(e => { bot.createMessage(msg.channel.id, e); });
		} if (/\-[^ ]/.test(suffix)) {
			settingsManager.unsubEvents(suffix.match(/(-[^ ]+)/g), msg.channel)
				.then(events => { bot.createMessage(msg.channel.id, `Unsubscribed from: \`${events.join('` `')}\``); })
				.catch(e => { bot.createMessage(msg.channel.id, e); });
		}
	}
}

var addIgnores = async function(bot, msg, suffix, settingsManager) {
	let args = suffix.match(/\((.+)\) *\((.+)\)/);
	if (args === null || args.length !== 3)
		args = suffix.match(/([^ ]+) +(.+)/);
	if (args === null || args.length !== 3)
		return bot.createMessage(msg.channel.id, "Please format your message like this: `ignore (@user | server | #channel) (+command | >all | ?command)`");
	let commands = args[2].split(/ *\| */).filter(x => x !== ''),
		scopes = args[1].split(/ *\| */).filter(x => x !== ''); // Remove empty entries from the array
	if (commands.length === 0 || scopes.length === 0)
		return bot.createMessage(msg.channel.id, "Please format your message like this: `ignore (@user | server | #channel) (+command | >all | ?command)`");

	scopes.forEach(scope => {
		let task,
			args;

		if (scope === 'server') {
			task = settingsManager.addIgnoreForGuild;
			args = [msg.channel.guild.id];

		} else if (/<@!?[0-9]+>/.test(scope)) { // If adjusting for a user
			let id = scope.match(/[0-9]+/)[0];
			if (msg.channel.guild.members.has(id)) {
				task = settingsManager.addIgnoreForUserOrChannel;
				args = [msg.channel.guild.id, 'userIgnores', id];
			} else
				return bot.createMessage(msg.channel.id, "Invalid user: " + scope);

		} else if (/<#[0-9]+>/.test(scope)) { // If adjusting for a channel
			let id = scope.match(/[0-9]+/)[0],
				channel = msg.channel.guild.channels.get(id);
			if (channel === null || channel.type === 'voice')
				return bot.createMessage(msg.channel.id, "Invalid text channel: " + scope);
			task = settingsManager.addIgnoreForUserOrChannel;
			args = [msg.channel.guild.id, 'channelIgnores', id];
		} else
			return bot.createMessage(msg.channel.id, `Invalid scope "${scope}"`);

		ignoreLoop(task, args, commands.slice()) // commands must be passed as a copy, NOT AS A REFERENCE
			.then(modified => {
				if (modified.length !== 0)
					bot.createMessage(msg.channel.id, `**Added the following ignores for ${scope}:**\n${modified.join(', ')}`);
				else
					bot.createMessage(msg.channel.id, `**No settings modified for ${scope}**`);
			})
			.catch(error => {
				bot.createMessage(msg.channel.id, `**Error adding ignores for ${scope}:**\n\t${error}`);
			});
	});
}

var removeIgnores = async function(bot, msg, suffix, settingsManager) {
	let args = suffix.match(/\((.+)\) *\((.+)\)/);
	if (args === null || args.length !== 3)
		args = suffix.match(/([^ ]+) +(.+)/);
	if (args === null || args.length !== 3)
		return bot.createMessage(msg.channel.id, "Please format you message like this: `unignore (@user | server | #channel) (+command | all | ?command)`");
	let commands = args[2].split(/ *\| */).filter(x => x !== ''),
		scopes = args[1].split(/ *\| */).filter(x => x !== '');
	if (commands.length === 0 || scopes.length === 0)
		return bot.createMessage(msg.channel.id, "Please format you message like this: `unignore (@user | server | #channel) (+command | all | ?command)`");
	console.dir(commands);
	console.dir(scopes);
	scopes.forEach(scope => {
		let task,
			args;

		if (scope === 'server') {
			task = settingsManager.removeIgnoreForGuild;
			args = [msg.channel.guild.id];

		} else if (/<@!?[0-9]+>/.test(scope)) {
			let id = scope.match(/[0-9]+/)[0];
			if (msg.channel.guild.members.has(id)) {
				task = settingsManager.removeIgnoreForUserOrChannel;
				args = [msg.channel.guild.id, 'userIgnores', id];
			} else
				return bot.createMessage(msg.channel.id, "Invalid user: " + scope);

		} else if (/<#[0-9]+>/.test(scope)) {
			let id = scope.match(/[0-9]+/)[0],
				channel = msg.channel.guild.channels.get(id);
			if (channel === null || channel.type === 'voice')
				return bot.createMessage(msg.channel.id, "Invalid text channel: " + scope);
			task = settingsManager.removeIgnoreForUserOrChannel;
			args = [msg.channel.guild.id, 'channelIgnores', id];
		} else
			return bot.createMessage(msg.channel.id, `Invalid scope "${scope}"`);

		try {
			let modified = await(ignoreLoop(task, args, commands.slice()))
			if (modified.length !== 0)
				bot.createMessage(msg.channel.id, `**Removed the following ignores for ${scope}:**\n${modified.join(', ')}`);
			else
				bot.createMessage(msg.channel.id, `**No settings modified for ${scope}**`);
		} catch (error) {
			bot.createMessage(msg.channel.id, `**Error removing ignores for ${scope}:**\n\t${error}`);
		}
	});
}

var ignoreLoop = async function(task, args, commands) {
	try {
		let modified = [];
		let b = await(task(...args, commands[0]))
		if (b === true)
			modified.push(commands[0]);
		commands.shift();
		if (commands.length > 0) {
			let m = await(ignoreLoop(task, args, commands))
			modified.push(m);
			return modified;
		} else
			return modified;
	} catch (err) {
		throw err;
	}
}

var checkIgnores = async function(bot, msg, suffix, settingsManager) {
	if (suffix) {
		let ignored;
		if (suffix === 'server')
			ignored = await(settingsManager.checkIgnoresFor(msg.channel.guild.id, 'guild'));
		else if (msg.channelMentions.length !== 0)
			ignored = await(settingsManager.checkIgnoresFor(msg.channel.guild.id, 'channel', msg.channelMentions[0]));
		else if (msg.mentions.length !== 0)
			ignored = await(settingsManager.checkIgnoresFor(msg.channel.guild.id, 'user', msg.mentions[0].id));
		else
			return bot.createMessage(msg.channel.id, 'Please specify "server", a channel, or a user');

		if (ignored.length === 0)
			bot.createMessage(msg.channel.id, 'Nothing ignored');
		else
			bot.createMessage(msg.channel.id, '**Ignored:**\n' + ignored.join(', '));
	} else
		bot.createMessage(msg.channel.id, '');
}

module.exports = {
	desc: "Adjust a server's settings.",
	help: `Modify how the bot works on a server.
	__welcome__: Set the channel and message to be displayed to new members \`welcome #general Welcome \${USER}/\${MENTION} to \${SERVER}\`.
	__events__: Modify event subscriptions \`events #event-log +memberjoined +userbanned -namechanged\`.
	__ignore__: Set commands that you wish to ignore on user/channel/server, you can also check with \`ignored user|channel|server\`
	__unignore__: Set commands that you wish to unignore on user/channel/server`,
	usage: "<welcome|events|ignore|unignore>",
	aliases: ['set', 'config'],
	cooldown: 3,
	requiredPermission: "manageGuild",
	guildOnly: true,
	task: async function(bot, msg, suffix, config, settingsManager) {
		if (suffix) {
			if (suffix.startsWith('welcome'))
				await(updateWelcome(bot, msg, suffix.substr(7).trim(), settingsManager));
			else if (suffix.startsWith('events'))
				await(handleEventsChange(bot, msg, suffix.substr(6).trim(), settingsManager));
			else if (suffix.startsWith('ignored'))
				await(checkIgnores(bot, msg, suffix.substr(13).trim().toLowerCase(), settingsManager));
			else if (suffix.startsWith('ignore'))
				await(addIgnores(bot, msg, suffix.substr(7).trim().toLowerCase(), settingsManager));
			else if (suffix.startsWith('unignore'))
				await(removeIgnores(bot, msg, suffix.substr(9).trim().toLowerCase(), settingsManager));
			else
				return 'wrong usage';
		} else
			return 'wrong usage';
	}
};