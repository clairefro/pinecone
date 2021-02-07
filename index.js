#!/usr/bin/env node

const fs = require("fs");
const chalk = require("chalk");
const slugify = require("slugify");

const info = (...info) => {
	console.log(chalk.green(info));
};

info("Reading file...\n");

const sourceFilePath = process.argv[2];
const outputDir = process.argv[3] || "./TUTORIAL_SECTIONS";
const outputFullTextFilename = "00_FULL.md";

if (!sourceFilePath) {
	throw new Error("Must provide source file path as first arg");
}

const sourceText = fs.readFileSync(sourceFilePath, "utf8", function (err, data) {
	if (err) throw err;
	return data.toString();
});

info("[[ SOURCE DOC PREVIEW ]]");
console.log(sourceText.slice(0, 250) + "...\n");

// RULES:
// 1. close all <img> tags
// 2. convert tutorial internal links to relative paths (https://redwoodjs.com/tutorial/getting-dynamic#creating-a-post-editor -> ./getting-dynamic#creating-a-post-editor -> )
// 3. convert line highlight syntax
// 4. split into sections
// 5. insert frontmatter

let outputText = sourceText;

// 1. close all <img> tags
info("Closing image tags...");

const unclosedImgTagRegex = /(<(?:img).+[^/?\s?])(>)/g;
outputText = outputText.replace(unclosedImgTagRegex, "$1/$2");

// 2. convert tutorial internal links to relative paths (https://redwoodjs.com/tutorial/getting-dynamic#creating-a-post-editor -> ./getting-dynamic#creating-a-post-editor -> )
info("Converting internal tutorial links to relative paths...");

const originalInternalTutorialLinkRegex = /(\]\()(https:\/\/redwoodjs.com\/tutorial\/)(.+?)\)/g;
outputText = outputText.replace(originalInternalTutorialLinkRegex, "$1./$3");

// 3. convert line highlight syntax (add a space between lang and {})
info("Fixing up code highlighting syntax...");

const originalCodeHighlightRegex = /(```\w+)(\{[\d,-]+\})/g;
outputText = outputText.replace(originalCodeHighlightRegex, "$1 $2");

// remove existing output dir and contents if exists
if (fs.existsSync(outputDir)) {
	fs.rmdirSync(outputDir, { recursive: true });
}

fs.mkdirSync(outputDir);

// write full file
const fullFilePath = [outputDir, outputFullTextFilename].join("/");
info("Cooking up your doctored file at " + fullFilePath);
try {
	fs.writeFileSync(fullFilePath, outputText);
} catch (err) {
	console.error(err);
}

// split into sections by H2
const sections = outputText.split(/^##(?!#)/gm);

sections.forEach((section) => {
	// write each section to a file in TUTORIAL_SECTIONS

	// grab title from first #
	const title = section.match(/^.+\n/)[0].replace("#", "").trim();
	// remove first line (# title) 
	section = section.replace(/^.+\n/,"")
  // add frontmatter
  const slugifiedTitle = slugify(title, { lower: true, strict: true });
  const frontmatter = `---
id: ${slugifiedTitle}
title: "${title}"
sidebar_label: "${title}"
---
`;
  section = frontmatter + section

	// build file configs
	const filename = slugifiedTitle + ".md";
	const outPath = [outputDir, filename].join("/");

	try {
		fs.writeFileSync(outPath, section);
	} catch (err) {
		console.error(err);
	}
});

info("Done!");
