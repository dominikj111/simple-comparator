# Simple Comparator

[![npm](https://img.shields.io/npm/v/simple-comparator)](https://www.npmjs.com/package/simple-comparator)
[![dependencies](https://img.shields.io/badge/production%20dependencies-0-brightgreen.svg)](https://github.com/dominikj111/simple-comparator/blob/main/package.json)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![License](https://img.shields.io/github/license/dominikj111/simple-comparator)](https://github.com/dominikj111/simple-comparator/blob/main/LICENSE)

> A powerful, flexible deep equality comparison production ready library for JavaScript and TypeScript, inspired by
> Jest's `toEqual()`. Works seamlessly in both Deno and Node.js environments.

## ✨ Features

- 🔍 **Deep Equality Comparison** - Compare nested objects and arrays with ease
- 🎯 **Selective Property Comparison** - Include or ignore specific properties
- 🔄 **Circular Reference Detection** - Optional detection of circular references
- 🎨 **Custom Equality Logic** - Define your own comparison rules with the `Comparable` interface
- 🔋 **Cross-Runtime Support** - Works in both Deno and Node.js
- 💡 **Type-Safe** - Written in TypeScript with full type definitions
- ⚡ **Performance Focused** - Optional features like circular reference detection

## 🚀 Why Choose Simple Comparator?

- **Zero Dependencies** - No external dependencies means smaller bundle size and no security vulnerabilities from
  third-party packages
- **Efficient Implementation** - Direct property comparison without using slow methods like `JSON.stringify()` or
  expensive hashing functions. For simple types, the performance is identical to using native comparison operators,
  making it safe to use everywhere in your code without performance overhead
- **Memory Efficient** - No object cloning or temporary data structures required during comparison
- **Flexible Yet Simple** - Powerful features without the complexity of libraries like `deep-equal` (which has 17+
  dependencies)
- **Browser Compatible** - Unlike some alternatives (e.g., deprecated `lodash.isequal`), works reliably in both Node.js
  and browser environments

## 🛠️ Installation

### Node.js

```bash
npm install simple-comparator
```

### Deno

Import directly from GitHub:

```typescript
import {
    compare,
    same,
    different,
} from "https://raw.githubusercontent.com/dominikj111/simple-comparator/refs/tags/v1.2.1/mod.js";
```

Or from your local files:

```typescript
import { compare, same, different } from "./mod.js";
```

## 🎮 Quick Start

```typescript
import { compare, same, different } from "simple-comparator";

// Basic comparison
compare({ a: 1, b: 2 }, { a: 1, b: 2 }); // true

// Natural syntax
if (same(user1, user2)) {
    console.log("Users are equal");
}

if (different(oldState, newState)) {
    console.log("State has changed");
}
```

## 💡 Advanced Features

### 1. Selective Property Comparison

```typescript
compare(
    { id: 1, name: "John", timestamp: Date.now() },
    { id: 2, name: "John", timestamp: Date.now() - 1000 },
    { topLevelIgnore: ["id", "timestamp"] },
); // true
```

### 2. Custom Equality Logic

```typescript
class Point implements Comparable<Point> {
    constructor(
        public x: number,
        public y: number,
    ) {}

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

compare(new Point(1, 2), new Point(1, 2)); // true
compare(new Point(1, 2), { x: 1, y: 2 }); // true (falls back to property comparison)
```

### 3. Circular Reference Detection

```typescript
const obj1: any = { a: 1 };
obj1.self = obj1;

const obj2: any = { a: 1 };
obj2.self = obj2;

compare(obj1, obj2, { detectCircular: true }); // true
```

### 4. Shallow Comparison

```typescript
const obj1 = { nested: { value: 1 } };
const obj2 = { nested: { value: 1 } };

compare(obj1, obj2, { shallow: true }); // false (different object references)
compare(obj1, obj2); // true (deep comparison)
```

## 🔧 Configuration Options

| Option            | Type                      | Description                               |
| ----------------- | ------------------------- | ----------------------------------------- |
| `topLevelInclude` | `string[] \| Set<string>` | Only compare these properties             |
| `topLevelIgnore`  | `string[] \| Set<string>` | Ignore these properties                   |
| `shallow`         | `boolean`                 | Use reference equality for nested objects |
| `detectCircular`  | `boolean`                 | Enable circular reference detection       |

## 🧪 Testing

The project includes comprehensive test suites for different JavaScript environments. When running `npm test -s` or
`yarn test`:

- ESLint checks are performed
- Jest tests are run for both CommonJS and ES modules
- Deno tests are executed if Deno is installed (skipped with a notification if Deno is not available)

This will execute:

- Node.js tests using Jest
- Deno tests using Deno's test runner with custom TypeScript configuration

## 📄 License

Apache-2.0 © dominikj111

This library is licensed under the Apache License, Version 2.0. You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>

## Roadmap

### Version 2

- [ ] Prototype chain comparison (see the [feature proposal](./feature_proposals/prototype-chain-comparison.md))
- [ ] Comprehesice type support (see the [feature proposal](./feature_proposals/comprehensive-type-support.md))
- [ ] Add performance benchmarks for different comparison scenarios
- [ ] Provide CDN-hosted bundles in both UMD and ESM formats for direct browser usage

### Version 3

- [ ] Add performance regression tests
- [ ] Enhance circular reference detection with WeakMap to store metadata (depth, path, corresponding object)
- [ ] Implement object signature caching using WeakMap for optimizing repeated comparisons (see the [feature proposal](./feature_proposals/object-signature-caching.md))

### Version 4

- [ ] Publish to JSR (Deno Registry) for better Deno integration
- [ ] Add input validation for comparison options
- [ ] Add option for partial array matching (e.g., array contains subset)
- [ ] Add option for fuzzy string comparison

---

<div align="center">
Made with ❤️ because I love coding
</div>
