## pinecone

A very niche-use node tool for converting redwood TUTORIAL (pt1) from .com site format to "learn" site format

### Install

```
yarn install
```

### Use

```
cd ..
node pinecone <input-path> [output-dir]
```

Go one dir ABOVE pinecone so you can run it pretending it's a binary 🙃.

For the input file, download the latest TUTORIAL.md to your local from [here](https://raw.githubusercontent.com/redwoodjs/redwoodjs.com/main/TUTORIAL.md).

A second optional arg allows you to specifcy the output dir for the converted file and sections (defaults to `./TUORIAL_SECTIONS`). Inside will be a fulll copy of the converted file `00_FULL.md`, as well as a breakdown by section:

```sh
TUTORIAL_SECTIONS
├── 00_FULL.md
├── administration.md
├── a-second-page-and-a-link.md
├── authentication.md
├── cells.md
├── deployment.md
├── everyones-favorite-thing-to-build-forms.md
├── getting-dynamic.md
├── installation-and-starting-development.md
├── layouts.md
├── our-first-page.md
├── prerequisites.md
├── redwood-file-structure.md
├── routing-params.md
├── saving-data.md
├── side-quest-how-redwood-works-with-data.md
├── welcome-to-redwood.md
└── wrapping-up.md

```

### Processing rules

This is what changes in the output file

1. close all <img> tags
2. convert tutorial internal links to relative paths (https://redwoodjs.com/tutorial/getting-dynamic#creating-a-post-editor -> ./getting-dynamic#creating-a-post-editor )
3. convert code line highlight syntax (add space between lang and {})
4. split into sections

Below is TODO

- insert frontmatter

- check that the section filenames match those on github...
