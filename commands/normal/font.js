var Jimp = require('jimp')
var fs = require('fs')
module.exports = {
	desc: "Type something in Comic Sans\n\tFonts: comic|dysgraphic",
	usage: "<text>",
	cooldown: 5,
	aliases: ['fonts'],
	task(bot, msg, suffix) {
		var args = suffix.split(" ")
		var typeface = "./special/font/" + args[0] + ".fnt"
		var writeImageText = args.slice(1).join(" ")
		fs.stat(typeface, function (err) {
			if (err) {
				bot.createMessage(msg.channel.id, "Sorry, but I don't have that font!")
			} else {
				bot.sendChannelTyping(msg.channel.id)
				Jimp.loadFont(typeface).then(function (font) {
					new Jimp(256, 256, function (err, image) {
						image.clone()
							.resize(writeImageText.length * 50, 100)
							.print(font, 0, 0, writeImageText)
							.getBuffer(Jimp.MIME_PNG, function (err, buffer) {
								bot.createMessage(msg.channel.id, "", {
									"file": buffer,
									"name": "woop.png"
								})
							})
							//.write("./font.png");
					});
				}).catch(function (err) {
					console.error(err);
				});
			}
		});
	}
}