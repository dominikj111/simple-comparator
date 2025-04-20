# Changelog

All notable changes to this project will be documented in this file.

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
