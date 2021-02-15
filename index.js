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
// 4. replace video player classes
// 5. split into sections
// 6. insert frontmatter

let outputText = sourceText;

// 1. close all <img> tags
info("Closing image tags...");

const unclosedImgTagRegex = /(<(?:img).+[^/?\s?])(>)/g;
outputText = outputText.replace(unclosedImgTagRegex, "$1/$2");

// 2. convert tutorial internal links to relative paths (https://redwoodjs.com/tutorial/getting-dynamic#creating-a-post-editor -> ./getting-dynamic#creating-a-post-editor -> )
info("Converting internal tutorial links to relative paths...");

// const originalAbsTutorial2LinkRegex = /(\]\()(https:\/\/redwoodjs.com\/tutorial2)/g;
// outputText = outputText.replace(originalAbsTutorial2LinkRegex, "$1/docs/tutorial2");
const originalRelTutorial2LinkRegex = /\/tutorial2/g;
outputText = outputText.replace(originalRelTutorial2LinkRegex, "%%%/docs/tutorial2"); // add %%% to prevent overwrite in relative link conversion
const originalAbsTutorialLinkRegex = /(\]\()(https:\/\/redwoodjs.com\/tutorial\/)(.+?)\)/g;
outputText = outputText.replace(originalAbsTutorialLinkRegex, "$1./$3");
// do the same for relative paths to tutorial 
const originalRelTutorialLinkRegex = /\((\/tutorial\/)/g;
outputText = outputText.replace(originalRelTutorialLinkRegex, "(./");
// any other relative links should be prepended with redwoodjs.com
const originalRelLinkRegex = /]\((\/.+?\/?.*?\))/g;
outputText = outputText.replace(
  originalRelLinkRegex,
  "](https://redwoodjs.com$1"
  );

const cleanup = /%%%(\/)/g;
outputText = outputText.replace(cleanup, "$1");

// 3. convert line highlight syntax (add a space between lang and {})
info("Fixing up code highlighting syntax...");

const originalCodeHighlightRegex = /(```\w+)(\{[\d,-]+\})/g;
outputText = outputText.replace(originalCodeHighlightRegex, "$1 $2");


// 4. Replace videoplayer classes
// <div class="relative pb-9/16 mt-4"> =>  <div class="video-container">
const videoContainerClassRegex = /(<div class=")(relative.+?)(")/g;
const newVideoContainerClass = "video-container";
outputText = outputText.replace(
	videoContainerClassRegex,
  `$1${newVideoContainerClass}$3`
);
// remove classes from iframes 
const iframeClassRegex = /(<iframe.+?)(class=".+?"\s?)/g;
outputText = outputText.replace(iframeClassRegex, "$1")

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

// 5. Split into sections by H2
const sections = outputText.split(/^##(?!#)/gm);

sections.forEach((section) => {
  // write each section to a file in TUTORIAL_SECTIONS

  // grab title from first #
  const title = section.match(/^.+\n/)[0].replace("#", "").trim();
  // remove first line (# title)
  section = section.replace(/^.+\n/, "");
  // 6. Add frontmatter
  let slugifiedTitle = slugify(title, { lower: true, strict: true });
  // speciall exception for "nstallation-starting-development"
  if (title.match(/&/)) {
    slugifiedTitle = slugifiedTitle.replace(/-and-/, "-");
  }
  const frontmatter = `---
id: ${slugifiedTitle}
title: "${title}"
sidebar_label: "${title}"
---
`;
  section = frontmatter + section;

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
