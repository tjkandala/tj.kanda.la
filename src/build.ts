import { readdir, rmdir, createReadStream, createWriteStream } from "fs";
import { promisify } from "util";
import { readFile, writeFile, mkdir, fstat } from "fs/promises";

import { Converter } from "showdown";
const converter = new Converter();
converter.setOption("noHeaderId", true);

const getFiles = promisify(readdir);
const rmrf = promisify(rmdir);
const postsDirectory = (name?: string) =>
  __dirname + "/../posts/" + (name || "");
const buildDirectory = __dirname + "/../build";

const createPage = (inner: string) => `<!DOCTYPE html>
<html>
  <head>
    <title>tj kandala</title>
    <link rel="stylesheet" href="./index.css" />
  </head>
  <body>
    ${inner}
    <script src="./index.js"></script>
  </body>
</html>
`;

async function main() {
  await rmrf(buildDirectory, { recursive: true });
  await mkdir(buildDirectory);

  const metadata: {
    [filename: string]: {
      title: string;
      date: string;
      genre: string;
    };
  } = {};

  // blog posts: markdown => html in /build
  const filenames = await getFiles(postsDirectory());
  await Promise.all(
    filenames.map(async name => {
      let file = await readFile(postsDirectory(name), "utf8");
      // parse metadata from post
      let keyword = file.substring(0, 4);

      if (keyword != "&&&&") {
        throw new Error("you didn't specify metadata!");
      }

      let rawmetadata = "";

      file = file.slice(4);
      let cursor = 0;

      // console.log(file);

      while (cursor < file.length) {
        keyword = file[cursor];
        if (keyword == "&") {
          // lookahead to next four characters
          keyword = file.substr(cursor, 4);
          if (keyword == "&&&&") {
            rawmetadata = file.slice(0, cursor);
            cursor += 4;
            break;
          }
        }

        cursor++;
      }
      file = file.slice(cursor);
      const jsonMetadata = JSON.parse(rawmetadata);

      // validate structure
      ["title", "date", "genre"].forEach(key => {
        if (!(key in jsonMetadata)) {
          throw new Error(`you forgot to specify ${key}`);
        }
      });

      metadata[name] = jsonMetadata;

      const page = createPage(converter.makeHtml(file));

      return writeFile(__dirname + `/../build/${name}.html`, page);
    })
  );

  const links = Object.keys(metadata).map(filename => {
    const { title, date, genre } = metadata[filename];
    return `<a href=${filename}.html>${title}</a>`;
  });

  // TODO: client side routing for page transitions

  const header = `<nav>${links.join("")}</nav>`;
  const footer = ``;

  let html = `<!DOCTYPE html>
  <html>
    <head>
      <title>tj kandala</title>
      <link rel="stylesheet" href="./index.css" />
    </head>
    <body>
      <h1>tj's personal website</h1>
      ${header}
      <script src="./index.js"></script>
    </body>
  </html>
  `;

  // copy index.(css|html|js) to /build
  const indexcssstream = createReadStream(__dirname + "/../public/index.css");
  indexcssstream.pipe(createWriteStream(__dirname + "/../build/index.css"));
  const indexjsstream = createReadStream(__dirname + "/../dist/index.js");
  indexjsstream.pipe(createWriteStream(__dirname + "/../build/index.js"));
  await writeFile(__dirname + "/../build/index.html", html);
}

main();
