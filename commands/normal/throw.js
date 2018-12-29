module.exports = {
	desc: "Hit someone with an item like MarioKart (Some quotes are from Team Fortress 2)",
	usage: "<@user>",
  aliases: ["item"],
	task(bot, msg, suffix) {
    if (msg.mentions.length === 1) {
      if (msg.author.id == msg.mentions[0].id) {
				bot.createMessage(msg.channel.id, `Don't throw something at yourself..`)
			} else if (msg.mentions[0].id == bot.user.id) {
				bot.createMessage(msg.channel.id, `nononono, not me ;-;`)
			} else {
        var items = [
          "🍏", "🍪", "🍺", "🔨", "💵", "🎁", "🗡", "✏", "🚬", "💣", "🔫", "🍎", "🍊", "🍐", "🍋",
          "🍉", "🍇", "🍓", "🍪", "🍒", "🌮", "💾", "📱", "🎉", "📷", "☎", "⏰", "🔑", "🏀", "⚽", "🎺", "🎨",
					"⚓", "🗑", "🍿", "🍭"
        ];
    		var randomItems = `${items[Math.floor(items.length * Math.random())]}`

        var quotes = [
          "but why...", "Oooookey..", "How dare you!",
          "The heck did you just do?", "What the fuck did you just fucking throw at me, you little bitch? I’ll have you know I graduated top of my class in the... whatever..",
          "Don't you do that again!", "Way to go, pally!", "That was unfortunate.",
          "Do you want war?", "You suck!", "pls dont", "why ;-;", "yooou!", "take that back!",
          "omg...", "are you stupid?!", "Nrgh, Arrggghh...", "Nrrgghh.", "Bugger.", "Gaaahhhh!", "Ahh, that was rubbish!",
					"Gaaahhhh!", "Awwww...", "Come on!", "Boooooooo!", "Aye, what just happened?", "Ugggghhh...", "Bloody Hell!",
					"AW CRIPE!", "You're makin' me very cross!", "Hsssssss!", "Boooooooo!",
        ];
        var randomQuotes = `${quotes[Math.floor(quotes.length * Math.random())]}`

        var quotes2 = [
          "How's that feel, wimp?", "I **wasted** you!", "Is-is anybody even payin' attention ta me?",
          "With my apologies.", "Pardon me.", "Surprise!", "I murdered your toys as well.", "Cheers",
          "What did you expect?", "The outcome was never really in doubt.", "Ka-boom!", "I never liked you.",
          "Oh yeah!", "Now that is what I wanna see!", "'Ere ya go.", "No worries!", "Excellent!", "Papers, please.",
					"I am prepared to do vatever it takes!", "Ha!", "Oktoberfest!", "Perfect!", "That'll teach ya!", "You're weak. I'm strong. and I win!",
					"Freeeedooooom!", "That wasn't supposed ta' happen!", "Aye, that's the way ye do it! Hehah!",
					"Any of you that think ye're better 'n me you're gon' have another thing c-...", "Ah, that's the stuff!", "Oh, too bloody easy!",
					"Hah! Barely broke a sweat!", "Done and done!", "Freedom! For unicorns!"
        ];
        var randomQuotes2 = `${quotes2[Math.floor(quotes2.length * Math.random())]}`

        bot.createMessage(msg.channel.id, `**${msg.author.username}** threw ${randomItems} at **${msg.mentions[0].username}**

${msg.mentions[0].username}: ${randomQuotes}
${msg.author.username}: ${randomQuotes2}`);
      }
    } else return 'wrong usage';
  }
}
