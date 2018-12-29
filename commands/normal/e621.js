var unirest = require("unirest");

module.exports = {
	desc: "e621 stuff (NSFW)",
	usage: "<search>",
	cooldown: 5,
	guildOnly: true,
	task(bot, msg, suffix) {
		if (msg.channel.name.indexOf("nsfw") != -1) {
			if (!suffix) return 'wrong usage';
			unirest.post(`https://e621.net/post/index.json?limit=30&tags=${suffix}`)
				.headers({
					'Accept': 'application/json',
					'User-Agent': 'Unirest Node.js'
				})
				// Fetching 30 posts from E621 with the given tags
				.end(function (result) {
					if(!result.body) return bot.createMessage(msg.channel.id, 'sorry, nothing found.');
					if(!result.body.length) return bot.createMessage(msg.channel.id, 'sorry, nothing found.');
					if(result.body.length < 1 || result.body.length === undefined) return bot.createMessage(msg.channel.id, 'sorry, nothing found')
else {
						var count = Math.floor((Math.random() * result.body.length))
						if (!(result && result.body[count] && result.body[count].file_url)) {
							bot.createMessage(msg.channel.id, 'sorry, nothing found.');
							return;
						} else {
								let le_porn = result.body[count].file_url;
						bot.createMessage(msg.channel.id, `${msg.author.username}\n${le_porn}`)
							.catch(error => msg.channel.createMessage(`Error: ${error}`))
						}
					}
				})
		} else bot.createMessage(msg.channel.id, "This command can only be used in channels containing the word `nsfw`")
	}
};
