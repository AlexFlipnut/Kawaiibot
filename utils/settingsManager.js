/*var reload = require('require-reload')(require),
	genericSettings = reload('../db/genericSettings.json'),
	commandSettings = reload('../db/commandSettings.json'),
	updateGeneric = false,
	updateCommand = false;*/
/*
const interval = setInterval(() => {
	if (updateGeneric === true) {
		utils.safeSave('db/genericSettings', '.json', JSON.stringify(genericSettings));
		updateGeneric = false;
	}
	if (updateCommand === true) {
		utils.safeSave('db/commandSettings', '.json', JSON.stringify(commandSettings));
		updateCommand = false;
	}
}, 20000);

function handleShutdown() {
	return Promise.all([utils.safeSave('db/genericSettings', '.json', JSON.stringify(genericSettings)), utils.safeSave('db/commandSettings', '.json', JSON.stringify(commandSettings))]);
}

function destroy() {
	clearInterval(interval);
	if (updateGeneric === true)
		utils.safeSave('db/genericSettings', '.json', JSON.stringify(genericSettings));
	if (updateCommand === true)
		utils.safeSave('db/commandSettings', '.json', JSON.stringify(commandSettings));
}
*/

function getBlankGuild(guildId) {
	return {
		guildId: guildId
	}
}
var getGuild = async function (guildId) {
	let storedGuild = await (r.table('guild').get(guildId).run());
	if (!storedGuild) storedGuild = getBlankGuild(guildId);
	return storedGuild;
}

var saveGuild = async function (guild) {
	return await (r.table('guild').get(guild.guildId).replace(guild));
};

/**
 * Manages settings for the bot.
 * @module settingsManager
 */

/////////// WELCOME MESSAGES ///////////

/**
 * Set a guild's welcome message. If only guildId is passed it will disable it.
 * @arg {String} guildId The guild to change settings for.
 * @arg {String} [channelId] The channel to set the welcome message to or "DM" to DM it.
 * @arg {String} [message] The welcome message to set.
 * @returns {Promise} Resolves when done modifying settings.
 */
var setWelcome = async function (guildId, channelId, message) {
	let storedGuild = await (r.table('guild').get(guildId).run());
	if (!storedGuild) {
		storedGuild = getBlankGuild(guildId);
	}
	if (!storedGuild.hasOwnProperty('welcome')) storedGuild.welcome = {};
	if (message) { //Setting message and enabling
		storedGuild.welcome = {
			message,
			channelId
		};
	} else {
		if (message && (storedGuild.welcome.message != message || storedGuild.welcome.channelId != channelId)) {
			storedGuild.welcome.message = message; //Changing message
			storedGuild.welcome.channelId = channelId;
		} else if (!message) { //disabling message that exists
			delete storedGuild.welcome;
		}
	}
	saveGuild(storedGuild);
}

/**
 * Get a server's welcome message settings.
 * @arg {Object} guild The guild to get the setings for.
 * @arg {String} member The user that joined.
 * @arg {Boolean} raw Return without placeholders replaced.
 * @returns {?Array<String>} Containing the channelId to send to and the message, or null.
 */
var getWelcome = async function (guild, member, raw) {
	let storedGuild = await (getGuild(guild.id));

	if (storedGuild.hasOwnProperty('welcome')) {
		return raw === true ? [storedGuild.welcome.channelId,
			storedGuild.welcome.message
		] : [storedGuild.welcome.channelId,
			storedGuild.welcome.message
			.replace(/\$\{USER\}/gi, member.user.username)
			.replace(/\$\{SERVER\}/gi, guild.name)
			.replace(/\$\{MENTION\}/gi, member.user.mention)
		]; //replace with names
	}
	return null;
}

/////////// EVENT NOTIFICATIONS ///////////

/**
 * A list of avalible events.
 * @const
 * @type Array<String>
 * @default
 */
const eventList = ['memberjoined', 'memberleft', 'userbanned', 'userunbanned', 'namechanged', 'nicknamechanged'];

/**
 * Change where event notifications &settings events #general +memberjoined +userbanned -namechangedare sent.
 * @arg {String} guildId The id of the guild to modify settings for.
 * @arg {String} [channelId] The channel to send events to. If undefined will disable them.
 */
var setEventChannel = async function (guildId, channelId) {
	let storedGuild = await (getGuild(guildId));
	if (!channelId && storedGuild.hasOwnProperty('events')) {
		delete storedGuild.events; //Disable event notifications
	} else if (channelId) {
		if (!storedGuild.hasOwnProperty('events')) {
			storedGuild.events = {
				channelId,
				subbed: []
			};
		} else if (storedGuild.events.channelId !== channelId) {
			storedGuild.events.channelId = channelId;
		}
	}
	await (saveGuild(storedGuild));
}

/**
 * Subscribe a guild to events.
 * @arg {Array} eventArray An array of strings containing the events to subscribe to.
 * @arg {Eris.Channel} channel The channel the message was sent in.
 * @returns {Promise<Array|String>} Will resolve if settings were changed with an array of subbed events. Else will reject with an error.
 */
var subEvents = async function (eventArray, channel) {
	let storedGuild = await (getGuild(channel.guild.id));
	if (!storedGuild.hasOwnProperty('events'))
		await (setEventChannel(channel.guild.id, channel.id));
	eventArray = eventArray.map(i => i.substr(1).toLowerCase());
	let subbedEvents = [];
	for (let e of eventList) {
		if (eventArray.includes(e) && !storedGuild.events.subbed.includes(e)) {
			storedGuild.events.subbed.push(e);
			subbedEvents.push(e);
		}
	}
	saveGuild(storedGuild);
	if (subbedEvents.length > 0) {
		return subbedEvents;
	} else {
		throw ('Subscribed to nothing');
	}
}

/**
 * Unsubscribe a guild to events.
 * @arg {Array} eventArray An array of strings containing the events to unsubscribe to.
 * @arg {Eris.Channel} channel The channel the message was sent in.
 * @returns {Promise<Array|String>} Will resolve if settings were changed with an array of unsubbed events. Else will reject with an error.
 */
var unsubEvents = async function (eventArray, channel) {
	let storedGuild = await (getGuild(channel.guild.id));
	if (!storedGuild.hasOwnProperty('events'))
		throw ('You are not subscribed to any events');
	eventArray = eventArray.map(i => i.substr(1).toLowerCase());
	let unsubbedEvents = [];
	for (let e of eventList) {
		if (eventArray.includes(e) && storedGuild.events.subbed.includes(e)) {
			storedGuild.events.subbed.splice(storedGuild.events.subbed.indexOf(e), 1);
			unsubbedEvents.push(e);
		}
	}
	if (storedGuild.events.subbed.length === 0) {
		delete storedGuild.events;
	}
	saveGuild(storedGuild);
	if (unsubbedEvents.length > 0)
		return unsubbedEvents;
	else
		throw ('Unsubscribed to nothing');
}

/**
 * Check if subscribed to an event and where to send it.
 * @arg {String} guildId The id of the guild to check.
 * @arg {String} eventQ The event to check.
 * @returns {?String} If subscribed, the channel id. If not, null.
 */
var getEventSetting = async function (guildId, eventQ) {
	let storedGuild = await (getGuild(guildId));
	return (genericSettingExistsFor(storedGuild, 'events') &&
			storedGuild.events.subbed.includes(eventQ) === true) ?
		storedGuild.events.channelId :
		null;
}

/**
 * Check what events a guild is subscribed to and where they are posted.
 * @arg {String} guildId The id of the guild to check.
 * @returns {?Object} An object containing channelId and the subbed events.
 */
var getGuildsEvents = async function (guildId) {
	let storedGuild = await (getGuild(guildId));
	return genericSettingExistsFor(storedGuild, 'events') ? storedGuild.events : null;
}

////////// NSFW ///////////

/**
 * Edit the NSFW channels option for a guild.
 * @arg {String} guildId The id of the guild.
 * @arg {String} channelId The channel to edit the settings for.
 * @arg {String} task A string with the value "allow" or "deny".
 * @returns {Promise<String>}
 */
var setNSFW = async function (guildId, channelId, task) {
	let storedGuild = await (getGuild(guildId));
	if (!storedGuild.hasOwnProperty('nsfw'))
		storedGuild.nsfw = [];

	if (task === 'allow' && !storedGuild.nsfw.includes(channelId)) {
		storedGuild.nsfw.push(channelId);
		saveGuild(storedGuild);
		return 'NSFW commands are now allowed here';
	} else if (task === 'deny' && storedGuild.nsfw.includes(channelId)) {
		storedGuild.nsfw.splice(storedGuild.nsfw.indexOf(channelId), 1);
		if (storedGuild.nsfw.length === 0)
			delete storedGuild.nsfw;
		saveGuild(storedGuild);
		return 'NSFW commands are no longer allowed here';
	} else {
		throw ('No settings changed');
	}
};

/**
 * Edit the NSFW channels option for a guild.
 * @arg {String} guildId The id of the guild.
 * @arg {String} channelId The channel to get the setting for.
 * @returns {Boolean} If NSFW is allowed in that channel.
 */
var getNSFW = async function (guildId, channelId) {
	let storedGuild = await (getGuild(guildId));
	return genericSettingExistsFor(guildId, 'nsfw') && storedGuild.nsfw.includes(channelId);
}

/**
 * Check what channels in a guild have NSFW enabled
 * @arg {String} guildId The id of the guild.
 * @returns {?Array<String>} An array of the channel ids.
 */
var getAllNSFW = async function (guildId) {
	let storedGuild = await (getGuild(guildId));
	return genericSettingExistsFor(guildId, 'nsfw') ? storedGuild.nsfw : null;
}

////////// COMMAND IGNORING //////////

/**
 * A list of commands loaded by the bot by prefix.
 * @type {Object}
 */
var commandList = {};

/**
 * Add an ignore setting for a user or channel.
 * @arg {String} guildId The guild to apply the setting change for.
 * @arg {String} type Either "userIgnores" or "channelIgnores".
 * @arg {String} id The user or channel to apply the setting change for.
 * @arg {String} command The command to ignore including prefix. Use "all" as the command to ignore all.
 * @returns {Promise<Boolean>} Resloves when done containg a boolean indicating if a setting was changed.
 */
var addIgnoreForUserOrChannel = async function (guildId, type, id, command) {
	let storedGuild = await (getGuild(guildId));
	if (!command || !guildId || !id || (type !== 'userIgnores' && type !== 'channelIgnores'))
		throw ('Invalid arguments');
	if (!storedGuild.hasOwnProperty(type))
		storedGuild[type] = {};
	if (!storedGuild[type].hasOwnProperty(id))
		storedGuild[type][id] = [];

	if (command === 'cleverbot') {
		if (!storedGuild[type][id].includes('all') && !storedGuild[type][id].includes('cleverbot')) {
			storedGuild[type][id].push('cleverbot');
			saveGuild(storedGuild);
			return true;
		}
		return false;
	}

	let prefix = Object.keys(commandList).find(p => command.startsWith(p));
	command = command.replace(prefix, '');

	if (command === 'all') {
		if (prefix === undefined)
			storedGuild[type][id] = ['all'];
		else if (storedGuild[type][id].length === 0)
			storedGuild[type][id].push(prefix + 'all');
		else if (!storedGuild[type][id].includes(prefix + 'all')) {
			for (let i = 0; i < storedGuild[type][id].length; i++) {
				if (storedGuild[type][id][i][0] === prefix)
					storedGuild[type][id].splice(i, 1);
			}
			storedGuild[type][id].push(prefix + 'all')
		} else
			return false;
		saveGuild(storedGuild);
		return true;

	} else if (prefix !== undefined && commandList.hasOwnProperty(prefix) && commandList[prefix].includes(command) && !storedGuild[type][id].includes('all') && !storedGuild[type][id].includes(prefix + 'all') && !storedGuild[type][id].includes(prefix + command)) {
		storedGuild[type][id].push(prefix + command);
		saveGuild(storedGuild);
		return true;
	}
	return false;
}

/**
 * Remove an ignore setting for a user or channel.
 * @arg {String} guildId The guild to apply the setting change for.
 * @arg {String} type Either "userIgnores" or "channelIgnores".
 * @arg {String} id The user or channel to apply the setting change for.
 * @arg {String} command The command to unignore including prefix. Use "all" as the command to unignore all.
 * @returns {Promise<Boolean>} Resloves when done containg a boolean indicating if a setting was changed.
 */
var removeIgnoreForUserOrChannel = async function (guildId, type, id, command) {
	let storedGuild = await (getGuild(guildId));
	if (!command || !guildId || !id || (type !== 'userIgnores' && type !== 'channelIgnores'))
		throw ('Invalid arguments');
	if (!commandSettingExistsFor(storedGuild, type) || !storedGuild[type].hasOwnProperty(id))
		return (false);

	if (command === 'cleverbot') {
		if (storedGuild[type][id].includes('cleverbot')) {
			storedGuild[type][id].splice(storedGuild[type][id].indexOf('cleverbot'), 1);
			if (storedGuild[type][id].length === 0) {
				delete storedGuild[type][id];
			}
			saveGuild(storedGuild);
			return (true);
		}
		if (storedGuild[type][id].includes('all')) {
			storedGuild[type][id] = [];
			for (let p in commandList) { // For all of the prefixes.
				if (commandList.hasOwnProperty(p))
					storedGuild[type][id].push(p + 'all');
			}
			saveGuild(storedGuild);
			return (true);
		}
		return (false);
	}

	let prefix = Object.keys(commandList).find(p => command.startsWith(p));
	command = command.replace(prefix, '');
	if (command === 'all') {
		if (prefix === undefined && storedGuild[type][id].length !== 0) {
			delete storedGuild[type][id];
		} else if (storedGuild[type][id].length !== 0) {
			if (storedGuild[type][id].includes('all')) {
				storedGuild[type][id] = [];
				for (let p in commandList) { // For all of the prefixes.
					if (p !== prefix && commandList.hasOwnProperty(p))
						storedGuild[type][id].push(p + 'all');
				}
				if (storedGuild[type][id].length === 0) {
					delete storedGuild[type][id];
				}
			} else if (storedGuild[type][id].includes(prefix + 'all')) {
				storedGuild[type][id].splice(storedGuild[type][id].indexOf(prefix + 'all'), 1);
				if (storedGuild[type][id].length === 0) {
					delete storedGuild[type][id];
				}
			} else {
				for (let i = 0; i < storedGuild[type][id].length; i++) {
					if (storedGuild[type][id][i].startsWith(prefix))
						storedGuild[type][id].splice(i, 1);
				}
				if (storedGuild[type][id].length === 0) {
					delete storedGuild[type][id];
				}
			}
		} else
			return (false);
		saveGuild(storedGuild);
		return (true);

	} else if (prefix !== undefined && commandList.hasOwnProperty(prefix) && commandList[prefix].includes(command)) {
		if (storedGuild[type][id].includes('all')) {
			storedGuild[type][id] = [];
			for (let p in commandList) { // For all of the prefixes.
				if (commandList.hasOwnProperty(p)) {
					if (p === prefix) {
						for (let c of commandList[p]) { // All of that prefix's commands.
							if (c !== command)
								storedGuild[type][id].push(p + c);
						}
					} else
						storedGuild[type][id].push(p + 'all');
				}
			}
		} else if (storedGuild[type][id].includes(prefix + 'all')) {
			storedGuild[type][id].splice(storedGuild[type][id].indexOf(prefix + 'all'), 1);
			for (let c of commandList[prefix]) { // All of that prefix's commands.
				if (c !== command)
					storedGuild[type][id].push(prefix + c);
			}
		} else if (storedGuild[type][id].includes(prefix + command)) {
			storedGuild[type][id].splice(storedGuild[type][id].indexOf(prefix + command), 1);
			if (storedGuild[type][id].length === 0) {
				delete storedGuild[type][id];
			}
		} else
			return (false);
		saveGuild(storedGuild);
		return (true);
	}
	return (false);
}

/**
 * Add an ignore setting for a guild.
 * @arg {String} guildId The guild to apply the setting change for.
 * @arg {String} command The command to ignore including prefix. Use "all" as the command to ignore all.
 * @returns {Promise<Boolean>} Resloves when done containg a boolean indicating if a setting was changed.
 */
var addIgnoreForGuild = async function (guildId, command) {
	let storedGuild = await (getGuild(guildId));
	if (!command || !guildId)
		throw ('Invalid arguments');
	if (!storedGuild.hasOwnProperty('guildIgnores'))
		storedGuild.guildIgnores = [];

	if (command === 'cleverbot') {
		if (!storedGuild.guildIgnores.includes('all') && !storedGuild.guildIgnores.includes('cleverbot')) {
			storedGuild.guildIgnores.push('cleverbot');
			saveGuild(storedGuild);
			return (true);
		}
		return (false);
	}

	let prefix = Object.keys(commandList).find(p => command.startsWith(p));
	command = command.replace(prefix, '');

	if (command === 'all') {
		if (prefix === undefined)
			storedGuild.guildIgnores = ['all'];
		else if (storedGuild.guildIgnores.length == 0)
			storedGuild.guildIgnores.push(prefix + 'all');
		else if (!storedGuild.guildIgnores.includes(prefix + 'all')) {
			for (let i = 0; i < storedGuild.guildIgnores.length; i++) {
				if (storedGuild.guildIgnores[i][0] === prefix)
					storedGuild.guildIgnores.splice(i, 1);
			}
			storedGuild.guildIgnores.push(prefix + 'all')
		} else {
			return (false);
		}
		saveGuild(storedGuild);
		return (true);

	} else if (prefix !== undefined && commandList.hasOwnProperty(prefix) && commandList[prefix].includes(command) && !storedGuild.guildIgnores.includes('all') && !storedGuild.guildIgnores.includes(prefix + 'all') && !storedGuild.guildIgnores.includes(prefix + command)) {
		storedGuild.guildIgnores.push(prefix + command);
		saveGuild(storedGuild);
		return (true);
	}
	return (false);
}

/**
 * Remove an ignore setting for a guild.
 * @arg {String} guildId The guild to apply the setting change for.
 * @arg {String} command The command to unignore including prefix. Use "all" as the command to unignore all.
 * @returns {Promise<Boolean>} Resloves when done containg a boolean indicating if a setting was changed.
 */
var removeIgnoreForGuild = async function (guildId, command) {
	let storedGuild = await (getGuild(guildId));
	if (!command || !guildId)
		throw ('Invalid arguments');
	if (!commandSettingExistsFor(storedGuild, 'guildIgnores'))
		return (false);

	if (command === 'cleverbot') {
		if (storedGuild.guildIgnores.includes('cleverbot')) {
			storedGuild.guildIgnores.splice(storedGuild.guildIgnores.indexOf('cleverbot'), 1);
			if (storedGuild.guildIgnores.length === 0) {
				delete storedGuild.guildIgnores;
			}
			saveGuild(storedGuild);
			return (true);
		}
		if (storedGuild.guildIgnores.includes('all')) {
			storedGuild.guildIgnores = [];
			for (let p in commandList) { // For all of the prefixes.
				if (commandList.hasOwnProperty(p))
					storedGuild.guildIgnores.push(p + 'all');
			}
			saveGuild(storedGuild);
			return (true);
		}
		return (false);
	}

	let prefix = Object.keys(commandList).find(p => command.startsWith(p));
	command = command.replace(prefix, '');

	if (command === 'all') {
		if (prefix === undefined && storedGuild.guildIgnores.length !== 0) {
			delete storedGuild.guildIgnores;
		} else if (storedGuild.guildIgnores.length !== 0) {
			if (storedGuild.guildIgnores.includes('all')) {
				storedGuild.guildIgnores = [];
				for (let p in commandList) { // For all of the prefixes.
					if (p !== prefix && commandList.hasOwnProperty(p))
						storedGuild.guildIgnores.push(p + 'all');
				}
				removeIfEmptyArray(storedGuild, 'guildIgnores');
			} else if (storedGuild.guildIgnores.includes(prefix + 'all')) {
				storedGuild.guildIgnores.splice(storedGuild.guildIgnores.indexOf(prefix + 'all'), 1);
				if (storedGuild.guildIgnores.length === 0) {
					delete storedGuild.guildIgnores;
				}
			} else {
				for (let i = 0; i < storedGuild.guildIgnores.length; i++) {
					if (storedGuild.guildIgnores.startsWith(prefix))
						storedGuild.guildIgnores.splice(i, 1);
				}
				if (storedGuild.guildIgnores.length === 0) {
					delete storedGuild.guildIgnores;
				}
			}
		} else
			return (false);
		saveGuild(storedGuild);
		return (true);

	} else if (prefix !== undefined && commandList.hasOwnProperty(prefix) && commandList[prefix].includes(command)) {
		if (storedGuild.guildIgnores.includes('all')) {
			storedGuild.guildIgnores = [];
			for (let p in commandList) { // For all of the prefixes.
				if (commandList.hasOwnProperty(p)) {
					if (p === prefix) {
						for (let c of commandList[p]) { // All of that prefix's commands.
							if (c !== command)
								storedGuild.guildIgnores.push(p + c);
						}
					} else
						storedGuild.guildIgnores.push(p + 'all');
				}
			}
		} else if (storedGuild.guildIgnores.includes(prefix + 'all')) {
			storedGuild.guildIgnores.splice(storedGuild.guildIgnores.indexOf(prefix + 'all'), 1);
			for (let c of commandList[prefix]) { // All of that prefix's commands.
				if (c !== command)
					storedGuild.guildIgnores.push(prefix + c);
			}
		} else if (storedGuild.guildIgnores.includes(prefix + command)) {
			storedGuild.guildIgnores.splice(storedGuild.guildIgnores.indexOf(prefix + command), 1);
			if (storedGuild.guildIgnores.length === 0) {
				delete storedGuild.guildIgnores;
			}
		} else
			return (false);
		saveGuild(storedGuild);
		return (true);
	}
	return (false);
}

/**
 * Check if a command is ignored.
 * @arg {String} prefix The command's prefix or an empty string for cleverbot.
 * @arg {String} command The name of the command including prefix or "cleverbot".
 * @arg {String} guildId The guild to check for.
 * @arg {String} channelId The channel to check for.
 * @arg {String} userId The user to check for.
 * @returns {Boolean} If the command is ignored.
 */
var isCommandIgnored = async function (prefix, command, guildId, channelId, userId) {
	let storedGuild = await (getGuild(guildId));
	console.dir(storedGuild);
	if (!command || !guildId || !channelId || !userId) {
		return false;
	}
	if (storedGuild.hasOwnProperty('guildIgnores') && (storedGuild.guildIgnores[0] === 'all' || storedGuild.guildIgnores.includes(prefix + 'all') || storedGuild.guildIgnores.includes(prefix + command)))
		return true;
	if (storedGuild.hasOwnProperty('channelIgnores') && storedGuild.channelIgnores.hasOwnProperty(channelId) && (storedGuild.channelIgnores[channelId][0] === 'all' || storedGuild.channelIgnores[channelId].includes(prefix + 'all') || storedGuild.channelIgnores[channelId].includes(prefix + command)))
		return true;
	if (storedGuild.hasOwnProperty('userIgnores') && storedGuild.userIgnores.hasOwnProperty(userId) && (storedGuild.userIgnores[userId][0] === 'all' || storedGuild.userIgnores[userId].includes(prefix + 'all') || storedGuild.userIgnores[userId].includes(prefix + command)))
		return true;
	return false;
}

/**
 * Check what commands are ignored for something.
 * @arg {String} guildId The guild to check in.
 * @arg {String} type "guild", "channel", or "user".
 * @arg {String} [id] The id for the channel or user.
 * @returns {Array<String>} An array containing the ignored commands.
 */
var checkIgnoresFor = async function (guildId, type, id) {
	let storedGuild = await (getGuild(guildId));
	if (type === 'guild' && storedGuild.hasOwnProperty('guildIgnores'))
		return storedGuild.guildIgnores;
	else if (type === 'channel' && storedGuild.hasOwnProperty('channelIgnores') && storedGuild.channelIgnores.hasOwnProperty(id))
		return storedGuild.channelIgnores[id];
	else if (type === 'user' && storedGuild.hasOwnProperty('userIgnores') && storedGuild.userIgnores.hasOwnProperty(id))
		return storedGuild.userIgnores[id];
	return [];
}

////////// MISC ///////////

/**
 * Handles deleting settings for a channel when the channel is deleted.
 * @arg {Eris.Channel} channel The deleted channel.
 */
var handleDeletedChannel = async function (channel) {
	let storedGuild = await (getGuild(channel.guild.id));
	if (channel.guild !== undefined) {
		if (storedGuild.hasOwnProperty('welcome') && storedGuild.welcome.channelId === channel.id) {
			delete storedGuild.welcome;
		}
		if (storedGuild.hasOwnProperty('events') && storedGuild.events.channelId === channel.id) {
			delete storedGuild.events;
		}
		if (storedGuild.hasOwnProperty('nsfw') && storedGuild.nsfw.includes(channel.id)) {
			storedGuild.nsfw.splice(storedGuild.nsfw.indexOf(channel.id), 1);
		}
	}
	if (commandSettingExistsFor(storedGuild, 'channelIgnores') && storedGuild.channelIgnores.hasOwnProperty(channel.id)) {
		delete storedGuild.channelIgnores[channel.id];
	}
	saveGuild(storedGuild);
}

//Check if a guild has settings of a certain type
function genericSettingExistsFor(storedGuild, setting) {
	return storedGuild.hasOwnProperty(setting);
}

function commandSettingExistsFor(storedGuild, setting) {
	return storedGuild.hasOwnProperty(setting);
}

/*
//Used to remove unneccesary keys.
function removeIfEmpty(obj, key, updater) {
	if (Object.keys(obj[key]).length === 0) {
		delete obj[key];
		if (updater !== undefined)
			updater = true;
	}
}
*/

function removeIfEmptyArray(obj, key, updater) {
	if (obj[key].length === 0) {
		delete obj[key];
		if (updater !== undefined)
			updater = true;
	}
}

module.exports = {
	//destroy,
	//	handleShutdown,
	setWelcome,
	getWelcome,
	handleDeletedChannel,
	eventList,
	setEventChannel,
	subEvents,
	unsubEvents,
	getEventSetting,
	getGuildsEvents,
	setNSFW,
	getNSFW,
	getAllNSFW,
	commandList,
	addIgnoreForUserOrChannel,
	removeIgnoreForUserOrChannel,
	addIgnoreForGuild,
	removeIgnoreForGuild,
	isCommandIgnored,
	checkIgnoresFor,
};