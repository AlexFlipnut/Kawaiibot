const unirest = require('unirest');

const rightpad = (v, n, c = '0') => String(v).length >= n ? '' + v : String(v) + String(c).repeat(n - String(v).length);
const leftpad = (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n);

module.exports = {
	desc: "Shows the public botlist stats (no sellout or advertisement, just stats)",
	help: "1/2/3/etc...",
  hidden: true,
	ownerOnly: true,
	task(bot, msg, suffix) {
		unirest.get('https://www.carbonitex.net/discord/api/listedbots')
			.end(res => {
				let chunks = [];
				let bots = res.body.sort((a, b) => b.servercount - a.servercount);
		    bots = bots.filter(b => (b.servercount !== '0' && b.botid > 10));
		    bots = bots.map(b => {
		      b.name = b.name.replace(/[^a-z0-9]/gmi, '').replace(/\s+/g, '');
		      return b;
		    });
		    while (bots.length > 0) chunks.push(bots.splice(0, 10));
		    let page = Math.min(Math.max(parseInt(suffix), 1), chunks.length) || 1;
				let page_list = (`### Page ${page}/${chunks.length} ###\n` + chunks[page - 1].map((b, i) => `[${leftpad(((page-1)*10)+(i+1), 2)}]: ${rightpad(b.name, 20, ' ')}${b.servercount} Guilds`).join('\n'))
				bot.createMessage(msg.channel.id, "```markdown\n" + page_list + "\n```")
			})
	}
};
