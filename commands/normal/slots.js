module.exports = {
	desc: "Le slot machine",
	usage: "",
	cooldown: "5",
	aliases: ['slot', 'gamble'],
	task(bot, msg) {
		var emoji = ["🍎", "🍊", "🍐", "🍋", "🍉", "🍇", "🍓", "🍪", "🍒", "🌮"];
		var slotEmoji1 = emoji[Math.floor(emoji.length * Math.random())],
			slotEmoji2 = emoji[Math.floor(emoji.length * Math.random())],
			slotEmoji3 = emoji[Math.floor(emoji.length * Math.random())];
		var checkWin;

		if (slotEmoji1 == slotEmoji2 && slotEmoji2 == slotEmoji3) {
			checkWin = "and won!! 🎉"; /** CODE:NOTE I've done the math. There is a 1/1000 chance to win, or 0.1% */
		} else if (slotEmoji2 == slotEmoji3) {
			checkWin = "and almost won (2/3)";
		} else if (slotEmoji1 == slotEmoji3) {
			checkWin = "and almost won (2/3)";
		} else if (slotEmoji1 == slotEmoji2) {
			checkWin = "and almost won (2/3)";
		} else checkWin = "and lost...";

		bot.createMessage(msg.channel.id, `**${msg.author.username}** rolled the slot...\n[${slotEmoji1} ${slotEmoji2} ${slotEmoji3}]\n\n${checkWin}`);
	}
};