var unirest = require("unirest");

module.exports = {
	desc: "rule34 stuff (NSFW)",
	usage: "<search>",
	cooldown: 5,
	guildOnly: true,
	task(bot, msg, suffix) {
		if (msg.channel.name.indexOf("nsfw") != -1) {
			if (!suffix) return 'wrong usage';
			unirest.post('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + suffix)
				.end(function (result) {
					var xml2js = require('xml2js')
										if(!result.body) return bot.createMessage(msg.channel.id, 'sorry, nothing found.');
					if(!result.body.length) return bot.createMessage(msg.channel.id, 'sorry, nothing found.');
					if(result.body.length < 75 || result.body.length === undefined) return bot.createMessage(msg.channel.id, 'sorry, nothing found')
else {
						xml2js.parseString(result.body, function (err, result) {
							if (err) {
								bot.createMessage(msg.channel.id, 'The API returned an unconventional response.')
							} else {
								var count = Math.floor((Math.random() * result.posts.post.length))
								if (!(result && result.posts && result.posts.post)) {
									bot.createMessage(msg.channel.id, 'sorry, nothing found.');
									return;
								} else {
									let le_porn = 'http:' + result.posts.post[count].$.file_url;
									bot.createMessage(msg.channel.id, `${msg.author.username}\n${le_porn}`)
										.catch(error => msg.channel.createMessage(`Error: ${error}`))
								}
							}
						})
					}
				})
		} else bot.createMessage(msg.channel.id, "This command can only be used in channels containing the word `nsfw`")
	}
};
