const kawaiiGuild = '226959018722066432';
const updateRole = '304375023047802881';
const updateChannel = '304362355238764564';

module.exports = {
    desc: "Posts a changelog entry",
    usage: "-t title -d description [-b bug fixes] [-f new features]",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, suffix) {
        let args = argument.parseAsShell(suffix, {
            t: 1,
            d: 1,
            f: 1,
            b: 1
        });
        if ('t' in args.opts && 'd' in args.opts) {
            var chars = 0;
            var embed = {
                title: limit(args.opts.t, 256),
                description: limit(args.opts.d, 2048),
                fields: []
            };
            chars += embed.title.length + embed.description.length;
            if ('f' in args.opts) {
                embed.fields.push({
                    name: 'New Features',
                    value: limit(args.opts.f, 1024)
                });
                chars += embed.fields[embed.fields.length - 1].name.length
                    + embed.fields[embed.fields.length - 1].value.length;
            }
            if ('b' in args.opts) {
                embed.fields.push({
                    name: 'Bug Fixes',
                    value: limit(args.opts.b, 1024)
                });
                chars += embed.fields[embed.fields.length - 1].name.length
                    + embed.fields[embed.fields.length - 1].value.length;
            }
            if (chars > 4000) {
                bot.createMessage(msg.channel.id, 'Your changelog is over 4000 characters! Please revise.');
            } else {
                bot.editRole(kawaiiGuild, updateRole, {mentionable: true})
                    .then(bot.createMessage(updateChannel, {content: `<@&${updateRole}>`, embed}))
                    .then(bot.editRole(kawaiiGuild, updateRole, {mentionable: false}))
                    .catch(err => bot.createmessage(msg.channel.id, `Something went wrong!\n${err.stack}`));
            }
        } else {
            bot.createMessage(msg.channel.id, 'You must provide a title (-t) and a description (-d)');
        }
    }
};

function limit(text, chars) {
    text = text.toString();
    if (text.length > chars) {
        text = `${text.substring(0, chars - 3)}...`;
    }
    return text;
}

class Argument {
  constructor(bot) {}

  parseNaive(line) {
    return line.split(" ")
  }

  parseAsShell(line, optDef) {
    var opts = {}
    var args = []
    var optParams = []
    var keywords = line.match(/[^"\s]+|"(?:\\"|[^"])+"/g)
    if (keywords) {
      while(keywords.length > 0) {
        let keyword = keywords.shift()
        keyword = keyword.replace(/^"(.*)"$/, '$1') // remove surrounding ""
        keyword = keyword.replace('\\"', '"') // remove escaping
        if (optDef != null) {
          if (keyword.indexOf('--') == 0) { // single multi-chars option
            keyword = keyword.substring(2)
            opts[keyword] = []
            if (optDef != null) {
              if (keyword in optDef) {
                if (optDef[keyword] > 0) {
                  optParams.push({keyword:keyword, count:optDef[keyword]})
                }
              } else {
                throw new Error('Unknown option --'+keyword)
              }
            }
          } else if (keyword.indexOf('-') == 0) { // one or more single-chars options
            keyword = keyword.substring(1).split('')
            for (let val of keyword) {
              opts[val] = []
              if (optDef != null) {
                if (val in optDef) {
                  if (optDef[val] > 0) {
                    optParams.push({keyword:val, count:optDef[val]})
                  }
                } else {
                  throw new Error('Unknown option -'+val)
                }
              } 
            }
          } else if (optParams.length > 0) { // option value
            let param = optParams.shift()
            opts[param.keyword].push(keyword)
            param.count--
            if (param.count > 0) {
              optParams.unshift(param)
            }
          } else { // simple argument
            args.push(keyword)
          }
        } else {
          args.push(keyword)
        }
      }
    }
    return {opts : opts, args : args}
  }
}

const argument = new Argument();