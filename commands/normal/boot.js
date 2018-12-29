const dialogues = [
	msg => `**${msg.author.username}:** to ${msg.mentions[0].username} I leave... a boot to the head
**${msg.mentions[0].username}:** A WHAT?!
*${msg.author.username} threw a 👢 at ${msg.mentions[0].username}'s head*`,
	msg => `**${msg.mentions[0].username}:** Hey, I don't want no boot to the head.
**${msg.author.username}:** to dear ${msg.mentions[0].username}, who has never worked a day in his drunken life --
**${msg.mentions[0].username}:** I'm covering up my head!
**${msg.author.username}:** -- I leave my wine cellar and three crates of my finest whiskey.
**${msg.mentions[0].username}:** Really?
**${msg.author.username}:** And a boot on the head
*${msg.author.username} threw a 👢 at ${msg.mentions[0].username}'s head*`,
	msg => `**${msg.mentions[0].username}:** This is so predictable.
**${msg.author.username}:** I leave a boot to the head.
*${msg.author.username} threw a 👢 at ${msg.mentions[0].username}'s head*
**${msg.mentions[0].username}:** Uh! I knew it.`,
	msg => `**${msg.mentions[0].username}:** Oh, ah, I don't want nuthin'.
**${msg.author.username}:** -- who took care of me faithfully these many many years, who cared, made me laugh, brought me tea --
**${msg.mentions[0].username}:** Oh, I didn't mind.
**${msg.author.username}:** To ${msg.mentions[0].username}, I bequeath... a boot to the head.
*${msg.author.username} threw a 👢 at ${msg.mentions[0].username}'s head*`,
	msg => `**${msg.author.username}:** I leave you ${msg.mentions[0].username}, a lifetime supply of ice cream --
**${msg.mentions[0].username}:** t-that's all?
**${msg.author.username}:** That's all...
**${msg.mentions[0].username}:** but what flavour is it?
**${msg.author.username}:** boot to the head.
*${msg.author.username} threw a 👢 at ${msg.mentions[0].username}'s head*`
];

module.exports = {
	desc: "Throw a boot at someone's head",
	usage: "<@user>",
	guildOnly: true,
	task(bot, msg) {
		if (msg.mentions.length === 1) {
			var n = Math.floor(Math.random() * dialogues.length);
			bot.createMessage(msg.channel.id, dialogues[n](msg));
		} else return 'wrong usage';
	}
}
