import { useRef } from "react";
import { same } from "../../../src/comparator";

/**
 * Returns a stable reference to the value that only updates when the deep comparison fails.
 * More efficient than JSON.stringify for memoization dependencies.
 *
 * Optimization: Only performs deep comparison when the value reference changes,
 * avoiding expensive comparisons on every render.
 *
 * @template T - The type of value to stabilize
 * @param {T} value - The value to keep stable
 * @returns {T} A stable reference to the value
 *
 * @note Objects/arrays must follow React's immutability pattern. Mutations on the same
 * object reference will not trigger updates since the reference check will return false.
 *
 * @note If the caller constantly creates new objects with identical content, ComparatorService
 * will perform frequent deep comparisons. This is unavoidable but expected behavior.
 *
 * @example
 * const stablePayload = useStableState(payload);
 * // stablePayload only changes when payload deeply differs from previous value
 */
export function useStableState<T>(value: T): T {
  const ref = useRef<T>(value);
  const lastValueRef = useRef<T>(value);

  // Only compare if the value reference changed (new object/array/primitive)
  // This avoids expensive deep comparisons on every render when the input is the same reference
  if (lastValueRef.current !== value) {
    // Reference changed, now do the expensive deep comparison
    if (!same(ref.current as any, value as any)) {
      ref.current = value;
    }
    lastValueRef.current = value;
  }

  return ref.current;
}
