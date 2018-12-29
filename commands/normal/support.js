module.exports = {
	desc: "Get the official support links",
  aliases: ['donate', 'takemymoney'],
	task(bot, msg, suffix) {
    bot.createMessage(msg.channel.id, { content: ``,
      embed: {
        color: 0x2196F3,
        thumbnail: {
    			url: bot.user.avatarURL
    		},
        description: `Support the development of KawaiiBot by donating at
https://www.patreon.com/KawaiiBot

If you want to donate more than $1 and only once
https://www.paypal.me/AlexFlipnote

You can also visit our official server at
https://discord.gg/25WZgbs`,
      }
    });
	}
};
