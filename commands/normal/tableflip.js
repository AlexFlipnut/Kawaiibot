module.exports = {
	desc: "Mention someone and make someone or yourself tableflip (WARNING: Long text)",
	usage: "<@user> [text]",
	guildOnly: true,
	task(bot, msg, suffix) {
    var theText = suffix.replace(/<@\!?[0-9]+>/g, "").trim();
    if (!theText) return 'wrong usage';
    else bot.createMessage(msg.channel.id, `(╯°□°)╯︵ ┻━┻ ${theText}.

┻━┻ ︵ ヽ(°□°ヽ) ${theText}.

┻━┻ ︵ ＼('0')／ ︵ ┻━┻

${theText.toUpperCase()}!

ಠ\\_ಠ ${msg.mentions[0].username}...

ಠ\\_ಠ Put.

ಠ\\_\\_ಠ The tables.

ಠ\\_\\_\\_ಠ Back.

(╮°-°)╮┳━┳

(╯°□°)╯︵ ┻━┻ NEVER!﻿`);
  }
}
