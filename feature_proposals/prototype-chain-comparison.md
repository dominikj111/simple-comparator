# Prototype Chain Comparison Feature

## Overview

Add support for comparing objects with respect to their prototype chains through a dedicated module, keeping the core
comparator clean and efficient.

## Design Principles

1. **Modularity**: Implement as a separate module (`chainComparator.ts`) to maintain clean core functionality
2. **Minimal Core Changes**: Only essential updates to `comparator.ts`
3. **Opt-in Feature**: Disabled by default, enabled through CompareOptions
4. **Flexible Comparison Modes**: Support different levels of prototype chain comparison
5. **Enhancer Pattern**: Use the enhancer pattern to wrap and extend core comparator functionality
   - Non-invasive extension of core functionality
   - Composable with other feature enhancers
   - Clean separation of concerns
   - Easy testing of enhanced functionality

## Implementation

### 1. New Module: `chainComparator.ts`

```typescript
export interface ChainCompareOptions {
    mode: "none" | "own" | "inherited" | "full";
    depth?: number;
}

export function compareWithPrototype(a: object, b: object, options: ChainCompareOptions) {
    // Implementation of prototype chain comparison
}
```

### 2. Minimal Changes to Core (`comparator.ts`)

```typescript
interface CompareOptions {
    // ... existing options ...
    chainComparison?: boolean; // Simple flag to enable chain comparison
}
```

### 3. Integration Point (Using Enhancer Pattern)

The implementation uses the enhancer pattern to wrap and extend the core comparator:

```typescript
// In chainComparator.ts
export function enhanceComparator(originalCompare: typeof compare) {
    return function enhancedCompare(a: any, b: any, options: CompareOptions & ChainCompareOptions) {
        if (options.chainComparison) {
            return compareWithPrototype(a, b, options);
        }
        return originalCompare(a, b, options);
    };
}
```

This pattern allows:
- Clean integration with core functionality
- Easy composition with other enhancers
- Simple feature toggling
- Independent testing of chain comparison logic

### 4. Usage Examples

```typescript
// Basic usage (core functionality)
compare(obj1, obj2);

// With chain comparison
import { enhanceComparator } from "./chainComparator";
const compareWithChain = enhanceComparator(compare);

compareWithChain(obj1, obj2, {
    chainComparison: true,
    mode: "full",
    depth: 2,
});
```

## Benefits

1. Maintains clean core functionality
2. Provides flexible prototype chain comparison when needed
3. No performance impact when feature is not used
4. Easy to extend with additional chain comparison features

## Implementation Notes

- Keep core comparator.ts focused on basic comparison logic
- Use TypeScript's module system for clean separation
- Provide comprehensive tests in the chain comparison module
- Document all comparison modes and their use cases
