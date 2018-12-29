module.exports = {
    desc: "Runs a shell command.",
    usage: "<URL>",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, suffix) {
        let shard = parseInt(suffix);
        if (!isNaN(shard)) {
            process.send({
                type: "killShard",
                contents: shard
            });
            bot.createMessage(msg.channel.id, "Told the master thread to kill that shard and stuff");
        } else {
            bot.createMessage(msg.channel.id, "That wasn't a number");
        }
    }
};
