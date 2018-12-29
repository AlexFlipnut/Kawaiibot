const exec = require('child_process').exec;

module.exports = {
	desc: "Runs a shell command.",
	usage: "<URL>",
	hidden: true,
	ownerOnly: true,
	task(bot, msg, suffix) {
		exec(suffix, function(err, stdout, stderr){
			bot.createMessage(msg.channel.id, "```js\n" + stdout +"\n"+ stderr + "\n```" )
		});
	}
};
