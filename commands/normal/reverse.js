function reverseString(str) {
  return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}

module.exports = {
	desc: "Reverse something for the fun 🔁 nuf os",
	usage: "<text>",
	task(bot, msg, suffix) {
		if (!suffix)
			return 'wrong usage';
		msg.channel.createMessage(`🔁 ${reverseString(suffix)}`);
	}
};
