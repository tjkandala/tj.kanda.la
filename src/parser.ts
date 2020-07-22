import { readdir } from "fs";
import { promisify } from "util";
import { readFile } from "fs/promises";

/**
 * turns a subset of markdown into html files
 */

const getFiles = promisify(readdir);
const postsDirectory = (name?: string) =>
  __dirname + "/../posts/" + (name || "");

type State = "" | "";

async function main() {
  const filenames = await getFiles(postsDirectory());

  // TODO: use createReadStream! don't keep all files in memory. finish first tho
  const textPromises: Promise<string>[] = filenames.map(name =>
    readFile(postsDirectory(name), "utf8")
  );

  const files = await Promise.all(textPromises);

  for (const file of files) {
    console.log(file);
  }
}

main();
