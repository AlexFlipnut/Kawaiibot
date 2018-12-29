var fs = require("fs"),
	superagent = require("superagent"),
	reload = require("require-reload"),
	logger = new (reload("./Logger.js"))((reload("../config.json")).logTimestamp);


/**
 * Contains various functions.
 * @module utils
 */

/**
 * Save a file safely, preventing it from being cleared.
 * @arg {String} dir Path from root folder including filename. (EX: db/servers)
 * @arg {String} ext File extension.
 * @arg {String} data Data to be written to the file.
 * @arg {Number} minSize=5 Will not save if less than this size in bytes.
 * @arg {Boolean} log=5 If it should log to the console.
 * @returns {Promise<Boolean|Error>} Will resolve with true if saved successfully.
 */
exports.safeSave = function(file, ext, data, minSize = 5, log = true) {
	return new Promise((resolve, reject) => {
		if (!file || !ext || !data) {
			return reject(new Error("Invalid arguments"));
		}
		if (file.startsWith("/")) file = file.substr(1);
		if (!ext.startsWith(".")) ext = `.${ext}`;

		fs.writeFile(`${__dirname}/../${file}-temp${ext}`, data, error => {
			if (error) {
				logger.error(error, "SAFE SAVE WRITE");
				reject(error);
			} else {
				fs.stat(`${__dirname}/../${file}-temp${ext}`, (err, stats) => {
					if (err) {
						logger.error(err, "SAFE SAVE STAT");
						reject(err);
					} else if (stats.size < minSize) {
						logger.debug("Prevented file from being overwritten", "SAFE SAVE");
						resolve(false);
					} else {
						fs.rename(`${__dirname}/../${file}-temp${ext}`, `${__dirname}/../${file}${ext}`, e => {
							if (e) {
								logger.error(e, "SAFE SAVE RENAME");
								reject(e);
							} else {
								resolve(true);
							}
						});
						if (log === true) {
							logger.debug(`Updated ${file}${ext}`, "SAFE SAVE");
						}
					}
				});
			}
		});
	});
};

exports.updateWebsite = function(bot, file_path, server_count, user_count) {
	var totalCommandUsage = commandsProcessed + cleverbotTimesUsed;
	var avgCommandUsage = (totalCommandUsage / (bot.uptime / (1000 * 60))).toFixed(2);
	var statJson = {
		serverCount: server_count,
		userCount: user_count,
		totalCommands: totalCommandUsage,
		avgCommands: avgCommandUsage
	};
	var statsstring = JSON.stringify(statJson);
	fs.writeFile(file_path, statsstring, (error) => {
		logger.debug(`Updated bot server count to ${server_count}`, "WEBSITE STATS UPDATE");
		if (error) logger.error(error.status || error.response, "WEBSITE STATS UPDATE ERROR");
	});
};

/**
 * Find a member matching the input string or return null if none found
 * @arg {String} query The input.
 * @arg {Eris.Guild} guild The guild to look on.
 * @arg {Boolean} [exact=false] Only look for an exact match.
 * @returns {?Eris.Member} The found Member.
 */
exports.findMember = function(query, guild, exact = false) {
	let found = null;
	if (query === undefined || guild === undefined) {
		return found;
	}
	query = query.toLowerCase();
	guild.members.forEach(m => {
		if (m.user.username.toLowerCase() === query) found = m;
	});
	if (!found) {
		guild.members.forEach(m => {
			if (m.nick !== null && m.nick.toLowerCase() === query) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.user.username.toLowerCase().indexOf(query) === 0) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.nick !== null && m.nick.toLowerCase().indexOf(query) === 0) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.user.username.toLowerCase().includes(query)) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.nick !== null && m.nick.toLowerCase().includes(query)) found = m;
		});
	}
	return found;
};

/**
 * Find a user matching the input string or return null if none found
 * @arg {String} query The input.
 * @arg {Eris.Guild} guild The guild to look on.
 * @arg {Boolean} [exact=false] Only look for an exact match.
 * @returns {?Eris.User} The found User.
 */
exports.findUserInGuild = function(query, guild, exact = false) {
	let found = null;
	if (query === undefined || guild === undefined) {
		return found;
	}
	query = query.toLowerCase();
	guild.members.forEach(m => {
		if (m.user.username.toLowerCase() === query) found = m;
	});
	if (!found) {
		guild.members.forEach(m => {
			if (m.nick !== null && m.nick.toLowerCase() === query) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.user.username.toLowerCase().indexOf(query) === 0) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.nick !== null && m.nick.toLowerCase().indexOf(query) === 0) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.user.username.toLowerCase().includes(query)) found = m;
		});
	}
	if (!found && exact === false) {
		guild.members.forEach(m => {
			if (m.nick !== null && m.nick.toLowerCase().includes(query)) found = m;
		});
	}
	return found === null ? found : found.user;
};

/**
 * Update the server count on Carbon.
 * @arg {String} key The bot's key.
 * @arg {Number} servercount Server count.
 */
exports.updateCarbon = function(key, value) {
	if (!key || !value) return;
	value.key = key;
	superagent.post("https://www.carbonitex.net/discord/data/botdata.php")
		.type("application/json")
		.send(value)
		.end(error => {
			logger.debug(`Updated Carbon server count to ${value.servercount}`, "CARBON UPDATE");
			if (error) logger.error(error.status || error.response, "CARBON UPDATE ERROR");
		});
};

/**
 * Update the server count on bots.discordlist.net.
 * @arg {String} key The bot's key.
 * @arg {Number} servercount Server count.
 */
exports.updateBotlist = function(key, servers) {
	superagent.post("https://bots.discordlist.net/api")
		.type("form")
		.send({ token: key })
		.send({ servers: servers })
		.end((err, res) => {
			if (err) {
				logger.error(err, "DISCORDLIST UPDATE ERROR");
			} else {
				logger.debug(`Updated discordlist.net server count to ${servers}`, "DISCORDLIST UPDATE");
			}
		});
};

/**
 * Update the server count on [Abalabahaha's bot list]@{link https://bots.discord.pw/}.
 * @arg {String} key Your API key.
 * @arg {Number} server_count Server count.
 */
exports.updateAbalBots = function(id, key, value) {
	if (!key || !value) return;
	superagent.post(`https://bots.discord.pw/api/bots/${id}/stats`)
		.set("Authorization", key)
		.type("application/json")
		.send(value)
		.end(error => {
			logger.debug(`Updated bot server count to ${value.server_count}`, "ABAL BOT LIST UPDATE");
			if (error) logger.error(error.status || error.response, "ABAL BOT LIST UPDATE ERROR");
		});
};
exports.updateDBotsOrg = function(id, key, value) {
	if (!key || !value) return;
	superagent.post(`https://discordbots.org/api/bots/${id}/stats`)
		.set("Authorization", key)
		.type("application/json")
		.send(value)
		.end(error => {
			logger.debug(`Updated bot server count to ${value.server_count}`, "DISCORDBOTS.ORG LIST UPDATE");
			if (error) logger.error(error.status || error.response, "DISCORDBOTS.ORG LIST UPDATE ERROR");
		});
};
/**
 * Set the bot's avatar from /avatars/.
 * @arg {Eris.Client} bot The client.
 * @arg {String} url The direct url to the image.
 * @returns {Promise}
 */
exports.setAvatar = function(bot, url) {
	return new Promise((resolve, reject) => {
		if (bot !== undefined && typeof url === "string") {
			superagent.get(url)
				.end((error, response) => {
					if (!error && response.status === 200) {
						bot.editSelf({
							avatar: `data:${response.header["content-type"]};base64,${response.body.toString("base64")}`
						}).then(resolve).catch(reject);
					} else {
						reject(`Got status code ${error.status}` || error.response);
					}
				});
		} else {
			reject("Invalid parameters");
		}
	});
};

/**
 * Converts to human readable form
 * @arg {Number} milliseconds Time to format in milliseconds.
 * @returns {String} The formatted time.
 */
exports.formatTime = function(milliseconds) {
	let s = milliseconds / 1000;
	let seconds = (s % 60).toFixed(0);
	s /= 60;
	let minutes = (s % 60).toFixed(0);
	s /= 60;
	let hours = (s % 24).toFixed(0);
	s /= 24;
	let days = s.toFixed(0);
	return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
};

exports.getUserFromName = function(msg, name, quiet) {
	var userList;
	var userId;
	var discrim;
	if (/<@!?[0-9]{17,21}>/.test(name)) {
		userId = name.match(/<@!?([0-9]{17,21})>/)[1];
		if (bot.users.get(userId)) {
			return bot.users.get(userId);
		}
	}
	if (/[0-9]{17,21}/.test(name)) {
		userId = name.match(/([0-9]{17,21})/)[1];
		if (bot.users.get(userId)) {
			return bot.users.get(userId);
		}
	}
	if (/^.*#\d{4}$/.test(name)) {
		discrim = name.match(/^.*#(\d{4}$)/)[1];
		name = name.substring(0, name.length - 5);
	}
	// userList =
	userList = msg.channel.guild.members.filter(m => (m.user.username &&
		m.user.username.toLowerCase().indexOf(name.toLowerCase()) > -1 &&
		(discrim != undefined ? m.user.discriminator == discrim : true)) ||
		(m.nick &&
			m.nick.toLowerCase().indexOf(name) > -1 &&
			(discrim != undefined ? m.user.discriminator == discrim : true)));

	userList.sort((a, b) => {
		let thingy = 0;
		if (a.user.username.toLowerCase().indexOf(name.toLowerCase()) > -1 && a.user.username.startsWith(name)) {
			thingy += 100;
		}
		if (a.nick && a.nick.toLowerCase().indexOf(name.toLowerCase()) > -1 && a.nick.startsWith(name)) {
			thingy += 100;
		}
		if (b.user.username.toLowerCase().indexOf(name.toLowerCase()) > -1 && b.user.username.startsWith(name)) {
			thingy -= 100;
		}
		if (b.nick && b.nick.toLowerCase().indexOf(name.toLowerCase()) > -1 && b.nick.startsWith(name)) {
			thingy -= 100;
		}
		if (a.user.username.toLowerCase().indexOf(name.toLowerCase()) > -1 &&
			a.user.username.toLowerCase().startsWith(name.toLowerCase())) {
			thingy += 10;
		}
		if (a.nick && a.nick.toLowerCase().indexOf(name.toLowerCase()) > -1 &&
			a.nick.toLowerCase().startsWith(name.toLowerCase())) {
			thingy += 10;
		}
		if (b.user.username.toLowerCase().indexOf(name.toLowerCase()) > -1 &&
			b.user.username.toLowerCase().startsWith(name.toLowerCase())) {
			thingy -= 10;
		}
		if (b.nick && b.nick.toLowerCase().indexOf(name.toLowerCase()) > -1 &&
			b.nick.toLowerCase().startsWith(name.toLowerCase())) {
			thingy -= 10;
		}
		if (a.user.username.indexOf(name) > -1) {
			thingy++;
		}
		if (a.nick && a.nick.indexOf(name)) {
			thingy++;
		}
		if (b.user.username.indexOf(name) > -1) {
			thingy--;
		}
		if (b.nick && b.nick.indexOf(name)) {
			thingy--;
		}
		return -thingy;
	});
	userList.sort();

	if (userList.length == 1) {
		return userList[0].user;
	} else if (userList.length == 0) {
		if (!quiet) {
			bot.createMessage(msg.channel.id, `No users found.`);
		}
		return;
	} else {
		var userListString = "";
		for (var i = 0; i < userList.length; i++) {
			userListString += `- ${userList[i].user.username}#${userList[i].user.discriminator}\n`;
		}
		if (!quiet) {
			bot.createMessage(msg.channel.id, `Multiple users found!\n${userListString}`);
		}
		return;
	}
};
