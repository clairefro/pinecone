const fs = require("fs");

console.log("Reading file...");

const sourceFilePath = process.argv[2];

if (!sourceFilePath) {
	throw new Error("Must provide source file path as first arg");
}

const sourceText = fs.readFileSync(sourceFilePath, "utf8", function (err, data) {
	if (err) throw err;
	return data.toString();
});

console.log(sourceText.slice(0, 200));
