## pinecone

A very niche-use node tool for converting redwood TUTORIAL (pt1) from .com site format to "learn" site format

### Install

```
yarn install
```

### Use

```
cd ..
node pinecone <input-path> [output-path]
```

Go one dir ABOVE pinecone so you can run it pretending it's a binary 🙃.

Download the latest TUTORIAL.md to your local from (here)[https://raw.githubusercontent.com/redwoodjs/redwoodjs.com/main/TUTORIAL.md]. This will be the input file.

A second optional arg allows you to specifcy the output path for the converted file (defaults to `./TUORIAL_LEARN.md`)

### Processing rules

This is what changes in the output file

1. close all <img> tags
2. convert tutorial internal links to relative paths (https://redwoodjs.com/tutorial/getting-dynamic#creating-a-post-editor -> ./getting-dynamic#creating-a-post-editor -> )
3. convert code line highlight syntax

Below are TODO

4. split into sections
5. insert frontmatter
