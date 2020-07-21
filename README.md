# tj.kanda.la

My personal website + journal. Static site generator with zero runtime OR development dependencies (other than types :)).

Uses a DSL that is a subset of markdown

## How it works

- `/dist`: emitted js from tsc. called from `build` script
- `/build`: final bundle of index.(html|css|js)
