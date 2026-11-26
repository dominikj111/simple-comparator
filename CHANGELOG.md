# Changelog

All notable changes to this project will be documented in this file.

## [1.2.5] - 2026-11-26

### Fixed

    - Fixed type-checking in consumers without `strict`: the types entry pointed at TypeScript source, so
      consumers compiled the library's own files with their own compiler flags and hit
      `TS2578: Unused '@ts-expect-error' directive`

### Changed

    - Both builds now emit `.d.ts` declarations and the `types` conditions point at them;
      `index.ts` / `index.cts` are no longer published

### Improved

    - Packaging test now covers a non-strict ESM consumer and a CommonJS consumer, alongside the strict case

## [1.2.4] - 2026-11-26

### Fixed

    - Fixed the ESM entry point pointing at TypeScript source, which made `import` fail in Node.js
      (`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`)
    - Fixed the CommonJS entry point requiring a path the build had already renamed
      (`Cannot find module './src/comparator'`)
    - Fixed TypeScript resolution under `moduleResolution: nodenext`; emitted imports now carry the
      explicit `.js` extension
    - Fixed the Deno type check, which failed on the deprecated `baseUrl` compiler option

### Changed

    - CommonJS output keeps `.js` file names with a `"type": "commonjs"` marker instead of being
      renamed to `.cjs` after the build
    - Moved `benching` into a pnpm workspace, so one install covers both projects and the benchmark
      consumes the package by name instead of reaching into `src/`
    - Scoped the library's TypeScript, ESLint, Prettier and markdownlint configuration so the
      benchmark application no longer blocks `pnpm test`
    - Removed the unused `baseUrl` option, preparing for TypeScript 7
    - Declared `engines.node` (`>=18`); installs on older Node now warn

### Improved

    - Added a packaging test that installs the published tarball and exercises ESM, CommonJS and
      `nodenext` type resolution — the suite previously tested source only
    - Deno test failures now fail `pnpm test` instead of being reported as "Deno is not installed"

## [1.2.3] - 2025-04-20

### Fixed

    - Fixed VSCode Jest plugin integration
    - Fixed unit tests
    - Fixed ESLint configuration
    - Fixed import in TypeScript module
    - Fixed TypeScript configuration (no emitting build issue)

### Changed

    - Moved to pnpm package manager
    - Improved TypeScript configuration (more strict settings)
    - Added TypeScript check script
    - Updated deployment steps documentation

### Improved

    - Improved build process with rebuild functionality

## [1.2.2] - 2025-03-16

### Changed

    - Changed license from Apache-2.0 to BSD-3-Clause
    - Updated README with definite roadmap structure
    - Added feature proposals documentation:
        - Added comprehensive type support feature proposal
        - Added prototype chain comparison feature proposal
        - Added object signature caching feature proposal with requirements

### Fixed

    - Fixed README formatting issues with checkbox points
    - Fixed testing setup, added jsdom
    - Fixed Jest coverage feature
    - Fixed VSCode test settings

### Improved

    - Improved build process, generating CommonJS with cjs extension
    - Improved Deno support
    - Improved testing setup with refactoring
    - Added publint script and fixed package configuration
    - Updated package.json dependency versioning
    - ba22a19 Update dev dependencies to latest

## [1.2.1] - 2025-02-13

    - Fix: wrong Deno import url

## [1.2.0] - 2025-02-13

### Changed

    - Improved testing setup with better Deno integration and colored output
    - Enhanced build pipeline with minification
    - Improved code quality tooling and documentation

### Removed

    - Removed contribution guidelines as the library is now sealed

## [1.1.0] - Previous Release

### Added

    - Added circular reference detection
    - Added shallow comparison support
    - Added Set support for ignore/include options
    - Improved TypeScript types and documentation
    - Added Comparable interface for objects
    - Added support for Deno runtime

### Changed

    - Enhanced package metadata
    - Improved exports configuration
    - Updated keywords and license consistency
    - Fixed equals() method usage when comparing objects implementing Comparable interface

## [1.0.0] - Initial Release

### Added

    - Initial implementation with specifications
    - Support for CommonJS and ES6 distributions
    - Basic comparison functionality
    - TypeScript support
    - Initial documentation
