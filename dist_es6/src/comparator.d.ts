/**
 * A TypeScript library for deep comparison of objects, arrays, and primitive values.
 * Provides flexible comparison options including selective property comparison,
 * circular reference detection, and support for custom equality implementations.
 *
 * The library has special handling for objects implementing the Comparable interface:
 * - When comparing two Comparable objects, their equals() method is used
 * - When comparing a Comparable object with a non-Comparable object, it falls back to property comparison
 */
/**
 * Options for customizing the comparison behavior.
 *
 * @example
 * ```typescript
 * const options: CompareOptions = {
 *   topLevelInclude: ['id', 'timestamp'],
 *   topLevelIgnore: ['id2', 'timestamp2'],
 *   shallow: false,
 *   detectCircular: false
 * };
 * ```
 *
 * @param topLevelInclude - Array or Set of keys to compare. If provided, only these keys will be compared. An empty Set means "include nothing".
 * @param topLevelIgnore - Array or Set of keys to ignore on top level of the provided object or top level of any provided object in an array.
 * @param shallow - If true, performs shallow comparison. For objects and arrays after the first level, only references are compared instead of their contents.
 * @param detectCircular - If true, detects circular references. If false, returns false when a circular reference is detected.
 */
export interface CompareOptions {
    topLevelInclude?: string[] | Set<string>;
    topLevelIgnore?: string[] | Set<string>;
    shallow?: boolean;
    detectCircular?: boolean;
}
/**
 * Interface for implementing custom equality comparison logic.
 * Objects implementing this interface can define their own equality rules.
 *
 * @example
 * ```typescript
 * class Person implements Comparable<Person> {
 *   constructor(public name: string, public age: number) {}
 *
 *   equals(other: Person): boolean {
 *     return this.name === other.name && this.age === other.age;
 *   }
 * }
 * ```
 */
export interface Comparable<T> {
    equals: (_: T) => boolean;
}
/**
 * Type representing all supported primitive and wrapper types for comparison.
 * Includes strings, numbers, booleans, bigints (both primitive and object versions),
 * null, undefined, and objects implementing the Comparable interface.
 */
export type SimpleTypedVariable = string | String | boolean | Boolean | number | Number | null | undefined | bigint | BigInt | Comparable<any>;
/**
 * Type representing basic values that can be compared directly.
 * Can be either a SimpleTypedVariable or an array of SimpleTypedVariables.
 */
export type BasicCompareType = SimpleTypedVariable | SimpleTypedVariable[];
/**
 * Type representing a complex object structure that can be compared.
 * Objects can contain nested objects, arrays, or simple values of any supported type.
 */
export interface BasicCompareObject {
    [key: string]: BasicCompareObject | BasicCompareType | (BasicCompareObject | BasicCompareType)[];
}
export type CompareType = BasicCompareObject | BasicCompareType | (BasicCompareObject | BasicCompareType)[];
type TypeCheckerFunction = (_a?: CompareType, _b?: CompareType) => boolean;
interface TypeChecker {
    bothAreSameType: TypeCheckerFunction;
    isSimpleType: TypeCheckerFunction;
    bothAreNulls: TypeCheckerFunction;
    isNumber: TypeCheckerFunction;
    isNotNullObject: TypeCheckerFunction;
    bothAreNumbers: TypeCheckerFunction;
    bothAreNumbersAndNaNs: TypeCheckerFunction;
    bothAreNumbersAndOnlyOneIsNaN: TypeCheckerFunction;
    bothAreWrapperTypes: (_a?: CompareType, _b?: CompareType) => boolean;
    isComparableObject: (_a?: CompareType) => boolean;
    bothAreComparableObjects: (_a?: CompareType, _b?: CompareType) => boolean;
}
/**
 * Collection of type checking utilities used internally by the comparison functions.
 */
export declare const typeChecker: TypeChecker;
/**
 * Compares two values for deep equality with configurable comparison options.
 *
 * @example
 * ```typescript
 * // Basic comparison
 * compare({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 *
 * // Ignoring specific properties
 * compare(
 *   { id: 1, name: "John", age: 30 },
 *   { id: 2, name: "John", age: 30 },
 *   { topLevelIgnore: ["id"] }
 * ); // true
 *
 * // Shallow comparison
 * const obj1 = { a: { x: 1 } };
 * const obj2 = { a: { x: 1 } };
 * compare(obj1, obj2, { shallow: true }); // false (different object references)
 * compare(obj1, obj2); // true (deep comparison)
 *
 * // Circular reference detection
 * const circular1: any = { a: 1 };
 * circular1.self = circular1;
 * const circular2: any = { a: 1 };
 * circular2.self = circular2;
 * compare(circular1, circular2, { detectCircular: true }); // true
 *
 * // Custom equality using Comparable interface
 * class Point implements Comparable<Point> {
 *   constructor(public x: number, public y: number) {}
 *   equals(other: Point): boolean {
 *     return this.x === other.x && this.y === other.y;
 *   }
 * }
 * compare(new Point(1, 2), new Point(1, 2)); // true, uses Point's equals method
 * compare(new Point(1, 2), { x: 1, y: 2 });  // true, falls back to property comparison
 * ```
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param options - Comparison options
 * @returns True if values are equal according to comparison rules
 */
export declare function compare(a: CompareType, b: CompareType, options?: CompareOptions): boolean;
/**
 * Alias for the `compare` function. Provides a more natural way to check equality.
 *
 * @example
 * ```typescript
 * if (same(user1, user2, { topLevelIgnore: ["lastLoginTime"] })) {
 *   console.log("Users are equivalent");
 * }
 * ```
 */
export declare function same(a: CompareType, b: CompareType, options?: CompareOptions): boolean;
/**
 * Inverse of the `same` function. Returns true if values are not equal.
 *
 * @example
 * ```typescript
 * // Check if objects have different content
 * if (different(oldState, newState)) {
 *   console.log("State has changed");
 * }
 *
 * // Ignore volatile fields in comparison
 * if (different(record1, record2, {
 *   topLevelIgnore: ["timestamp", "version"]
 * })) {
 *   console.log("Records have different content");
 * }
 * ```
 */
export declare function different(a: CompareType, b: CompareType, options?: CompareOptions): boolean;
export {};
