import { readdir, rmdir, createReadStream, createWriteStream } from "fs";
import { promisify } from "util";
import { readFile, writeFile, mkdir } from "fs/promises";

import { Converter } from "showdown";
import { stdout } from "process";
const converter = new Converter();
converter.setOption("noHeaderId", true);

const getFiles = promisify(readdir);
const rmrf = promisify(rmdir);
const postsDirectory = (name?: string) =>
  __dirname + "/../posts/" + (name || "");
const buildDirectory = __dirname + "/../build";

type State = "" | "";

async function main() {
  await rmrf(buildDirectory, { recursive: true });
  await mkdir(buildDirectory);

  // blog posts: markdown => html in /build
  const filenames = await getFiles(postsDirectory());
  await Promise.all(
    filenames.map(async name => {
      const file = await readFile(postsDirectory(name), "utf8");
      const html = converter.makeHtml(file);
      return writeFile(__dirname + `/../build/${name}.html`, html);
    })
  );

  // copy index.(css|html|js) to /build
  const indexhtmlstream = createReadStream(__dirname + "/../public/index.html");
  indexhtmlstream.pipe(createWriteStream(__dirname + "/../build/index.html"));
  const indexcssstream = createReadStream(__dirname + "/../public/index.css");
  indexcssstream.pipe(createWriteStream(__dirname + "/../build/index.css"));
  const indexjsstream = createReadStream(__dirname + "/../dist/index.js");
  indexjsstream.pipe(createWriteStream(__dirname + "/../build/index.js"));
}

main();
