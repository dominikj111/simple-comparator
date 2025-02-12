
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
import { same, diff, compare } from "simple-comparator";

...

React.useEffect(() => {
    if (diff(state.var_1, state.var_2)) {
        // do some action
    }
}, [ state.var_1, state.var_2 ]);

...
```

# TODO List

- [x] Update documentation
- [x] Add TypeScript type documentation
- [ ] Readme file (make it more user friendly and attractive for other developers)
- [ ] Check other markdowns
- [ ] Update/improve the package.json

- [ ] Check/test other runtimes and environments

- [ ] Improve Continuous Integration (automatic build, linting and testing)
- [ ] Add Changelog

- [ ] Add test cases for comparing objects with prototype chain

- [ ] Add performance regression tests
- [ ] Add performance benchmarks for different comparison scenarios
- [ ] Document performance implications of different options

- [ ] Add bundling to import from CDN (vanilla js) -> umd, esm

## Current Improvements

- [x] Optimize circular reference detection by making it optional (detectCircular option)
- [ ] Add input validation for comparison options
- [ ] Add option for partial array matching (e.g., array contains subset)
- [ ] Add option for fuzzy string comparison
- [ ] Support complex types Regex, Map, Set, functions, ... (AI_INSTRUCTIONS: list them all)

## Future Possible Improvements (v2)

- [ ] Enhance circular reference detection with WeakMap to store metadata (depth, path, corresponding object)
