var reload = require('require-reload')(require),
    entities = require('entities'),
	logger = new(reload('../utils/Logger.js'))((reload('../config.json')).logTimestamp, 'yellow'),
	antiSpam = {};

var cleverbot = require("cleverbot.io"),
		clever = new cleverbot('E14dBOlGVrG4wUKi','SohSduvYq5THLjfCcXpGd6u4KsQIzqjA');

var ready = false;

function spamCheck(userId, text) {
	if (!antiSpam.hasOwnProperty(userId)) { //If user not there add them
		antiSpam[userId] = text;
		return true;
	}
	if (antiSpam[userId] == text) //If user sent the same message ignore it
		return false;
	antiSpam[userId] = text;
	return true;
}

// prepare
clever.setNick("kawaiibot");
clever.create((err) => {
    if (!err) ready = true
});

function trimText(cleanContent, name) {
	return cleanContent.replace(`@${name}`, '').trim(); //Removes the @Bot part
}

/*function processUnicode(text) {
	if (/\|/g.test(text)) //Cleverbot returns unicode like |1234 for some reason. This fixes it
		return text.replace(/\|/g, '\\u').replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16))); //unescape unicode
	return text;
}*/

module.exports = async function (bot, msg, config, settingsManager) {
    if (!ready) return;
	if (msg.channel.guild !== undefined && !msg.channel.permissionsOf(msg.author.id).has('manageChannels') && await(settingsManager.isCommandIgnored('', 'cleverbot', msg.channel.guild.id, msg.channel.id, msg.author.id)) === true)
		return;
	let text = msg.channel.guild === undefined ? msg.cleanContent : trimText(msg.cleanContent, msg.channel.guild.members.get(bot.user.id).nick || bot.user.username);
	if (spamCheck(msg.author.id, text)) {
		cleverbotTimesUsed++;
		logger.logCommand(msg.channel.guild === undefined ? null : msg.channel.guild.name, msg.author.username, '@' + bot.user.username, text);
		if (text === '') //If they just did @Botname
			bot.createMessage(msg.channel.id, 'Yes?');
		else {
			bot.sendChannelTyping(msg.channel.id).then(() => {
                clever.ask(text, (err, response) => {
                    if (!err)
                        bot.createMessage(msg.channel.id, '💬 ' + response);
                    else { //API returned nothing back
                        logger.warn('Nothing was returned by the cleverbot API. Reloading it now.');
                        bot.createMessage(msg.channel.id, '⚠ There was an error, try again.');
                    }
                });
            });
		}
	}
}
