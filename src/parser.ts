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

    const tokens = tokenize(file);
  }
}

main();

/** [type, token] */
type Token =
  | ["title", "*title*"]
  | ["heading", "*head*"]
  | ["subheading", "*subhead*"]
  | ["paragraph", "*p*"]
  | ["bold", "|b|"]
  | ["italics", "|i|"]
  | ["link", string];

/**
 *
 * grammar of my blog DSL:
 *
 * Why?
 *
 *
 * @param source
 */
function tokenize(source: string) {
  const len = source.length;
  let cursor = 0;
  let tokens: string[] = [];
  let char: string;

  while (cursor < len) {
    char = source[cursor];

    switch (char) {
      case "*":
        // lookahead
        let lookahead = cursor + 1;
        let possibleKeyword = "";
        while (lookahead < len) {
          let nextChar = source[lookahead];
          if (nextChar == "*") {
            cursor = lookahead;
            break;
          }
          possibleKeyword += nextChar;
          lookahead++;
        }

        console.log(possibleKeyword);

        switch (possibleKeyword) {
          case "title":
            break;
          case "heading":
            break;
          case "subhead":
            break;
          case "p":
            console.log("paragraph tag!");
            break;

          default:
            // illegal, throw error
            console.log("illegal!");
        }

        tokens.push(char);
        break;

      case "|":
        break;

      default:
        break;
    }

    cursor++;
  }
}

type ParseTree = {};

function parse(tokens: Token[]): ParseTree {
  const parseTree = {};

  return parseTree;
}

function render(parseTree: ParseTree): string {
  let html = "";

  return html;
}

/**
 * exercises:
 * - write 'isEmail'
 * - write 'is IPv4'
 */
