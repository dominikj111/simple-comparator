# Comprehensive Type Support Feature

## Overview

Add support for comparing additional JavaScript/TypeScript built-in types through a dedicated module, following the same
modular architecture pattern used for other features.

## Types to Support

### 1. Collection Types

- [x] Map
- [x] Set
- [ ] WeakMap (limited support - compare only available references)
- [ ] WeakSet (limited support - compare only available references)

### 2. Binary Data Types

- [ ] ArrayBuffer
- [ ] TypedArrays (Int8Array, Uint8Array, etc.)
- [ ] DataView
- [ ] Blob

### 3. Built-in Objects

- [ ] Date (with timezone consideration option)
- [ ] RegExp (compare pattern and flags)
- [ ] Error (and its subtypes)
- [ ] URL and URLSearchParams
- [ ] Symbol properties
- [ ] Function properties (optional comparison of source/name/length)

### 4. Special Number Types

- [x] BigInt
- [ ] Special values (Infinity, -Infinity, NaN - enhanced handling)

### 5. DOM Types (Optional Browser Support)

- [ ] Node
- [ ] Element
- [ ] Event

## Implementation

### 1. New Module: `typeComparator.ts`

```typescript
export interface TypeCompareOptions {
    // Control which special type comparisons are enabled
    collections?: boolean; // Map, Set, etc.
    binaryData?: boolean; // ArrayBuffer, TypedArrays
    builtins?: boolean; // Date, RegExp, etc.
    functions?: boolean; // Function comparison
    dom?: boolean; // DOM types (browser only)

    // Type-specific options
    date?: {
        ignoreTimezone?: boolean;
    };
    regexp?: {
        patternOnly?: boolean; // Ignore flags
    };
    error?: {
        messageOnly?: boolean; // Ignore stack trace
    };
    function?: {
        nameOnly?: boolean; // Compare only function names
        sourceOnly?: boolean; // Compare only source code
    };
}
```

### 2. Minimal Core Changes

```typescript
interface CompareOptions {
    // ... existing options ...
    typeSupport?: boolean; // Simple flag to enable enhanced type support
}
```

### 3. Integration (Using Enhancer Pattern)

```typescript
// In typeComparator.ts
export function enhanceWithTypeSupport(originalCompare: typeof compare) {
    return function typeEnhancedCompare(a: any, b: any, options: CompareOptions & TypeCompareOptions) {
        if (!options.typeSupport) {
            return originalCompare(a, b, options);
        }

        // Handle special types
        if (isSpecialType(a) || isSpecialType(b)) {
            return compareSpecialTypes(a, b, options);
        }

        return originalCompare(a, b, options);
    };
}
```

## Usage Examples

```typescript
import { enhanceWithTypeSupport } from "./typeComparator";
const compareWithTypes = enhanceWithTypeSupport(compare);

// Compare Dates
compareWithTypes(new Date(), new Date(), {
    typeSupport: true,
    date: { ignoreTimezone: true },
});

// Compare RegExp
compareWithTypes(/pattern/g, /pattern/g, {
    typeSupport: true,
    regexp: { patternOnly: false },
});

// Compare TypedArrays
const arr1 = new Int8Array([1, 2, 3]);
const arr2 = new Int8Array([1, 2, 3]);
compareWithTypes(arr1, arr2, { typeSupport: true });
```

## Benefits

1. Comprehensive support for JavaScript/TypeScript built-in types
2. Modular implementation following established patterns
3. Fine-grained control over type comparison behavior
4. No performance impact when feature is disabled
5. Easy to extend for new types

## Implementation Notes

- Keep core comparator.ts focused on basic comparison logic
- Implement type detection and comparison in separate module
- Use TypeScript type guards for safe type checking
- Provide comprehensive tests for each type
- Document type-specific comparison behavior
- Consider browser vs Node.js environment differences
- Handle edge cases (null prototypes, proxies, etc.)
