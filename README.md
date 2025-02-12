# Simple Comparator

[![GitHub version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.1.0&x2=0)](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.1.0&x2=0)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![dependency status](https://deps.rs/crate/autocfg/1.1.0/status.svg)](https://deps.rs/crate/autocfg/1.1.0)

A powerful, flexible deep equality comparison production ready library for JavaScript and TypeScript, inspired by Jest's `toEqual()`. Works seamlessly in both Deno and Node.js environments.

## 🚀 Features

- 🔍 **Deep Equality Comparison** - Compare nested objects and arrays with ease
- 🎯 **Selective Property Comparison** - Include or ignore specific properties
- 🔄 **Circular Reference Detection** - Optional detection of circular references
- 🎨 **Custom Equality Logic** - Define your own comparison rules with the `Comparable` interface
- 🔋 **Cross-Runtime Support** - Works in both Deno and Node.js
- 💡 **Type-Safe** - Written in TypeScript with full type definitions
- ⚡ **Performance Focused** - Optional features like circular reference detection

## 📦 Installation

### Node.js

```bash
npm install simple-comparator
```

### Alternative Package Managers

The library can also be installed using Bun:

```bash
bun add simple-comparator
```

Note: `bun test` doesn't work as expected with this library as there are Deno tests included and bun can't resolve the `assert_equals` module.

### Deno

Import directly from GitHub:

```typescript
import { compare, same, different } from "https://raw.githubusercontent.com/dominikjelinek/simple-comparator/index-deno.js";
```

Or from your local files:

```typescript
import { compare, same, different } from "./index-deno.js";
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

## 🛠️ Advanced Features

### 1. Selective Property Comparison

```typescript
compare(
    { id: 1, name: "John", timestamp: Date.now() },
    { id: 2, name: "John", timestamp: Date.now() - 1000 },
    { topLevelIgnore: ["id", "timestamp"] }
); // true
```

### 2. Custom Equality Logic

```typescript
class Point implements Comparable<Point> {
    constructor(public x: number, public y: number) {}
    
    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

compare(new Point(1, 2), new Point(1, 2)); // true
compare(new Point(1, 2), { x: 1, y: 2 });  // true (falls back to property comparison)
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

| Option | Type | Description |
|--------|------|-------------|
| `topLevelInclude` | `string[] \| Set<string>` | Only compare these properties |
| `topLevelIgnore` | `string[] \| Set<string>` | Ignore these properties |
| `shallow` | `boolean` | Use reference equality for nested objects |
| `detectCircular` | `boolean` | Enable circular reference detection |

## 🧪 Testing

Run the test suite which includes tests for both Node.js and Deno environments:

```bash
npm test
```

This will execute:

- Node.js tests using Jest
- Deno tests using Deno's test runner with custom TypeScript configuration

## 📄 License

Apache-2.0 © dominikj111

This library is licensed under the Apache License, Version 2.0. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

## TODO List

### Documentation

✅ Update documentation  
✅ Add TypeScript type documentation  
✅ Readme file (make it more user friendly and attractive for other developers)  
⬜ Check other markdowns  
⬜ Update/improve the package.json  

### Testing & CI

⬜ Check/test other runtimes and environments  
⬜ Improve Continuous Integration (automatic build, linting and testing)  
⬜ Add test cases for comparing objects with prototype chain  
⬜ Add performance regression tests  

### Performance

⬜ Add performance benchmarks for different comparison scenarios  
⬜ Document performance implications of different options  

### Distribution

⬜ Add bundling to import from CDN (vanilla js) -> umd, esm  
⬜ Add Changelog  
⬜ Publish to JSR (Deno Registry) for better Deno integration  

### Features & Improvements

✅ Optimize circular reference detection by making it optional  
⬜ Add input validation for comparison options  
⬜ Add option for partial array matching (e.g., array contains subset)  
⬜ Add option for fuzzy string comparison  
⬜ Support complex types (Regex, Map, Set, functions)  

### Future (v2)

⬜ Enhance circular reference detection with WeakMap to store metadata (depth, path, corresponding object)  
