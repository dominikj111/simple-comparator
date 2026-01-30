# simple-comparator Benchmark Suite

Performance benchmarking application comparing deep equality comparison methods for JavaScript objects.

## Overview

Benchmarks comparison methods showing both raw performance and real-world advantages:

**Comparison Methods:**

- **simple-comparator** - Deep equality with `same()` function
- **simple-comparator-selective** - Compares only specified fields (performance optimization)
- **simple-comparator-stable** - useStableState pattern with reference optimization
- **JSON.stringify** - Common but limited workaround
- **reference-equality** - JavaScript's default `===` comparison

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Test Scenarios

### Basic Performance Tests

- **small** - Simple 4-field object
- **medium** - Nested object with arrays (10 items)
- **large** - Complex object (50 users, 100 posts with comments)
- **huge** - Deeply nested arrays (200 items, 5 levels deep)

### Advantage Tests (where simple-comparator excels)

- **selective** - Wide object (100+ fields) with selective comparison
- **key-order** - Objects with different key ordering (JSON.stringify fails)
- **circular** - Circular references (JSON.stringify throws error)
- **stable-same-ref** - Same reference optimization (useStableState pattern)
- **stable-new-ref** - New reference, same content (common React pattern)

### Execution Modes

- **Serial** (recommended) - Tests run sequentially, prevents UI freeze
- **Parallel** - All tests run simultaneously for faster results

### Metrics Measured

- **Execution time** (milliseconds)
- **Time per 1000 operations** (normalized comparison)

## Features

- ✅ Live progress tracking with status indicators
- ✅ Serial and parallel execution modes
- ✅ Responsive design with dark/light mode support
- ✅ Built with React Compiler for optimal performance
- ✅ Real-world testing using actual React `useEffect` behavior

## Implementation Details

**How Benchmarks Work:**

- Each test runs comparison operations in a loop (500-100,000 iterations)
- Tests execute asynchronously via `setTimeout` to prevent UI blocking
- Measurements use `performance.now()` for high-precision timing
- Test objects regenerated with `Math.random()` to prevent engine optimization

**Architecture:**

- **BenchmarkRunner** - Orchestrates execution, manages state, displays results table
- **Benchmark** - Individual test runner executing comparison iterations
- **testDataGenerator** - Creates objects of varying size/complexity
- **types.ts** - TypeScript definitions for configs and results

## Tech Stack

- React 19 with React Compiler (babel-plugin-react-compiler)
- TypeScript
- Vite (build tool)
- simple-comparator library (parent project)

## Results Interpretation

**Lower time = Better performance**

Metrics show:

- Raw execution speed (total ms)
- Normalized performance (ms per 1000 operations)

**Key insights:**

- Selective comparison reduces cost on large objects
- useStableState pattern optimizes React re-render scenarios
- simple-comparator handles edge cases (key ordering, circular refs) that JSON.stringify cannot

Note: Results vary by browser, hardware, and JavaScript engine optimizations.
