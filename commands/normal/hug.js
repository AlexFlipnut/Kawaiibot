var request = require("request");

module.exports = {
	desc: "Hug someone for the lolz",
	usage: "<@user>",
	cooldown: 5,
	task(bot, msg) {
		if (msg.mentions.length === 1) {
			if (msg.author.id == msg.mentions[0].id) {

				bot.sendChannelTyping(msg.channel.id);
				request({ url: "http://media.tumblr.com/tumblr_mabh68A9Xd1qfkm7e.gif", encoding: null }, (err, response) => {
					if (err) {
						bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {"wait": 8000});
						}); return;
					}
					if (response.statusCode != 200) {
						bot.createMessage(msg.channel.id, "Got status code " + response.statusCode, function (erro, wMessage) {
							bot.deleteMessages(wMessage, { "wait": 8000 });
						}); return;
					}
					bot.createMessage(msg.channel.id, `Sorry to see you alone **${msg.author.username}**, have a cat ;-;`, {
						file: response.body, name: 'selfhug.gif'
					});
				});

			} else if (msg.mentions[0].id == bot.user.id) {
				bot.createMessage(msg.channel.id, `*hugs ${msg.author.username} back* :heart:`)
			} else {
				bot.sendChannelTyping(msg.channel.id);
				var gifs = [
					"https://media.tenor.co/images/08de7ad3dcac4e10d27b2c203841a99f/raw",
					"https://myanimelist.cdn-dena.com/s/common/uploaded_files/1461068547-d8d6dc7c2c74e02717c5decac5acd1c7.gif",
          "https://m.popkey.co/fca5d5/bXDgV.gif",
          "https://myanimelist.cdn-dena.com/s/common/uploaded_files/1461073447-335af6bf0909c799149e1596b7170475.gif",
          "https://myanimelist.cdn-dena.com/s/common/uploaded_files/1461068486-646f3523d0fd8f3e6d818d96012b248e.gif",
          "https://s-media-cache-ak0.pinimg.com/originals/16/46/f7/1646f720af76ea58853ef231028bafb1.gif",
					"https://dpegb9ebondhq.cloudfront.net/users/avatars/28540738/mktpl_large/130.gif",
					"http://66.media.tumblr.com/0194da0a507f683b83c10e82150d38dc/tumblr_ngxxivVcQx1u57npgo1_500.gif",
					"https://media.tenor.co/images/e07a54a316ea6581329a7ccba23aea2f/tenor.gif",
					"http://i.imgur.com/cZWWATV.gif",
					"http://i.imgur.com/2WywS3T.gif",
					"http://s7.favim.com/orig/151124/anime-couple-gif-hug-Favim.com-3637687.gif",
					"http://25.media.tumblr.com/tumblr_mbsv1ubbzX1qg78wpo1_500.gif",
					"http://www.abload.de/img/yui_azusa_haligejrg.gif",
					"https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif",
					"https://myanimelist.cdn-dena.com/s/common/uploaded_files/1460992224-9f1cd0ad22217aecf4507f9068e23ebb.gif",
					"http://data.whicdn.com/images/120988792/original.gif",
					"https://media.giphy.com/media/C4gbG94zAjyYE/giphy.gif",
					"https://s-media-cache-ak0.pinimg.com/originals/a9/03/7c/a9037c528ef88d325634c2d4449fa60b.gif",
					"http://data.whicdn.com/images/43699247/large.gif",
					"https://66.media.tumblr.com/b6a47c5357f54d1f7e6cede64ba41167/tumblr_o552iu3vuQ1uiicp5o1_500.gif",
					"http://i.imgur.com/Lrt0G3P.gif",
					"http://66.media.tumblr.com/6f2d387fab35b0bcca1866cdcac9b2a8/tumblr_o8m1t3qJSN1sb5zl8o1_500.gif",
					"http://37.media.tumblr.com/f2a878657add13aa09a5e089378ec43d/tumblr_n5uovjOi931tp7433o1_500.gif",
					"https://im1.ibsear.ch/4/1b/ec3f27c7ba22fc329d409acd6f791.gif",
					"https://im1.ibsear.ch/a/45/fae9bed7900aaea73c032f749d23f.gif",
					"https://im1.ibsear.ch/1/86/da4a74b65729a82bbd868c3c92325.gif",
					"https://im1.ibsear.ch/2/c6/c489d97c91e9ec904a9ac7545865d.gif",
					"https://im1.ibsear.ch/c/99/cc20abcde995a0dfa05035ee5bf0d.gif",
					"https://im1.ibsear.ch/a/e5/00b9eaafd3bc89127fd27dc8f3dc6.gif",
					"https://im1.ibsear.ch/e/e8/65b6526040af8e010fc81a5658794.gif",
					"https://im1.ibsear.ch/e/4e/fcf0b7bbb3b388574af9196bf7572.gif",
					"https://im1.ibsear.ch/f/2e/67f04b6a0ab30870011bd17190409.gif",
					"https://im1.ibsear.ch/6/b2/26704a91ab175ffc236f3a6573aaf.gif"
				];
				var url = `${gifs[Math.floor(gifs.length * Math.random())]}`
				request({
					url: url,
					encoding: null
				}, (err, response) => {
					if (err) {
						bot.createMessage(msg.channel.id, "Error: " + err, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {
								"wait": 8000
							});
						});
						return;
					}
					if (response.statusCode != 200) {
						bot.createMessage(msg.channel.id, "Got status code " + response.statusCode, function (erro, wMessage) {
							bot.deleteMessages(wMessage, {
								"wait": 8000
							});
						});
						return;
					}
					bot.createMessage(msg.channel.id, `**${msg.mentions[0].username}**, you got a hug from **${msg.author.username}**`, {
						file: response.body,
						name: 'hug.gif'
					});
				});
			}
		} else return 'wrong usage';
	}
};
