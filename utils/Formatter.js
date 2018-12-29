exports.formatFlags = function(args) {
	let flags = {};
	for (let arg of args) {
		let index = args.indexOf(arg);
		if (arg.startsWith("-")) {
			let flag = args.slice(index+1).join(" ");
			if (RegExp('".*"').test(flag)) {
				flag = flag.match(/"(?:\\"|[^"])+"|[^\s]+/g)[0]
				.slice(1)
				.slice(0, -1);
			} else flag = args[index+1] || true;
			flags[arg.replace(/-/g, "")] = flag;
		}
	}
	return flags;
}
