
<!-- markdownlint-disable MD041 -->

[![GitHub version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.1.0&x2=0)](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.1.0&x2=0)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![dependency status](https://deps.rs/crate/autocfg/1.1.0/status.svg)](https://deps.rs/crate/autocfg/1.1.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# What is it?

The JS/TS utility to confirm deep equality of two simple objects, arrays or simple data type, to be used in Deno and Node.js.

The bahaviour match the `toEqual()` matcher function of the Jest library.

The orignal inspiration went from the issue in React.js application I had, where the `useEffect` triggered change to the global context of changed variable, but with same content.

Ready to be used in Deno and Node.js. To see more details how to use it, please check related unit tests in `./src/*.spec.ts` and tests in `./tests` folder.

## Deno example

`deno test https://raw.githubusercontent.com/dominikj111/simple-comparator/main/tests/deno.test.ts` or

`deno test https://raw.githubusercontent.com/dominikj111/simple-comparator/main/tests/deno.test.js`

## How to get it on Node.js or Bun

`npm i simple-comparator`, `bun add simple-comparator`

`bun test` doesn't work as expected with this library as there are Deno tests included and bun can't resolve the `assert_equals` module.

# Problems to solve

As a develoer, I want:

- To deeply compare two objects, arrays or simple data type.

```ts
import { same, diff, compare } from "simple-comparator/index";

...

React.useEffect(() => {
    if (diff(state.var_1, state.var_2)) {
        // do some action
    }
}, [ state.var_1, state.var_2 ]);

...
```

# Possible improvements when requested

:black_square_button: Add bundling to import from CDN (vanilla js) -> umd, esm

:black_square_button: Improve Continuous Integration (automatic build, linting and testing)

:black_square_button: Add Changelog, Code of Conduct
