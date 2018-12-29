module.exports = {
	desc: "Runs a shell command.",
	usage: "<URL>",
	hidden: true,
	ownerOnly: true,
	task(bot, msg) {
		function getShards() {
			return bot.shards.map((s) => `${s.id} - ${s.status} - ${bot.guilds.size}`).join("\n");
		}
		process.retrieve("_evaluateAll", `${getShards.toString()}\ngetShards()`).then(shards => {
			msg.channel.createMessage(`\`\`\`\n${shards.join("\n")}\n\`\`\``);
		});
	}
};
