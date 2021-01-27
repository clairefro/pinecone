const fs = require("fs");
const chalk = require("chalk");

const info = (info) => {
	console.log(chalk.green(info));
};

info("Reading file...\n");

const sourceFilePath = process.argv[2];

if (!sourceFilePath) {
	throw new Error("Must provide source file path as first arg");
}

const sourceText = fs.readFileSync(sourceFilePath, "utf8", function (err, data) {
	if (err) throw err;
	return data.toString();
});

info("[[ PREVIEW ]]");
console.log(sourceText.slice(0, 250) + "...");
