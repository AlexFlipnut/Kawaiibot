const superagent = require("superagent");

module.exports = {
    desc: "Evaluates all the shards",
    usage: "<code>",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, suffix) {
        process.retrieve("_evaluateAll", suffix).then(res => {
            let multiType = false;
            let type;
            for (const result of res) {
                if (!type) {
                    type = typeof result;
                } else if (type !== typeof result) {
                    multiType = true;
                }
            }
            let total;
            if (!multiType) {
                switch (type) {
                    case "number": {
                        total = res.reduce((a, b) => a + b);
                        break;
                    }
                }
            }
            let chars = 0;
            let embed = {
                fields: []
            };
            if (total) {
                embed.description = limit(total, 2048);
            }
            for (let i = 0; i < res.length; i++) {
                let title = limit(i + 1, 256);
                let value = limit(res[i], 1024);
                chars += title.length + value.length;
                embed.fields.push({ name: title, value, inline: true });
            }
            if (chars > 4000 || embed.fields.length > 25) {
                let fileOutput = "";
                if (total) {
                    fileOutput += `${total}\n====================\n\n`;
                }
                for (let i = 0; i < res.length; i++) {
                    fileOutput += `${i + 1}\n--------------------\n${res[i]}\n\n`;
                }
                bot.createMessage(msg.channel.id, undefined, {
                    name: "output.txt",
                    file: fileOutput
                });
            } else {
                bot.createMessage(msg.channel.id, { embed });
            }
        }).catch(err => {
            console.error(err);
            bot.createMessage(msg.channel.id, `\`\`\`diff\n- ${err.message}\n\`\`\``);
        });
    }
};

function limit(text, chars) {
    text = text.toString();
    if (text.length > chars) {
        text = `${text.substring(0, chars - 3)}...`;
    }
    return text;
}
