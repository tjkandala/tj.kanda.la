import { readdir } from "fs";
import { promisify } from "util";
import { readFile } from "fs/promises";

/**
 * parses the DSL for .la files
 *
 * .la grammar:
 *
 *
 */

const getFiles = promisify(readdir);
const postsDirectory = (name?: string) =>
  __dirname + "/../posts/" + (name || "");

type State = "" | "";

async function main() {
  const filenames = await getFiles(postsDirectory());

  const textPromises: Promise<string>[] = filenames.map(name =>
    readFile(postsDirectory(name), "utf8")
  );

  const files = await Promise.all(textPromises);

  for (const file of files) {
    console.log(file);
  }
}

main();

function tokenizer(source: string) {
  let state = "";
}
