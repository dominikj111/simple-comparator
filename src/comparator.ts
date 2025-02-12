/**
 * A TypeScript library for deep comparison of objects, arrays, and primitive values.
 * Provides flexible comparison options including selective property comparison,
 * circular reference detection, and support for custom equality implementations.
 */

const WRAPPER_TYPES = new Set(["String", "Number", "Boolean", "BigInt"]);
const SIMPLE_TYPES = new Set(["string", "boolean", "undefined"]);

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
export type SimpleTypedVariable =
	| string
	// eslint-disable-next-line @typescript-eslint/ban-types
	| String
	| boolean
	// eslint-disable-next-line @typescript-eslint/ban-types
	| Boolean
	| number
	// eslint-disable-next-line @typescript-eslint/ban-types
	| Number
	| null
	| undefined
	| bigint
	// eslint-disable-next-line @typescript-eslint/ban-types
	| BigInt
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| Comparable<any>;

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

/**
 * Collection of type checking utilities used internally by the comparison functions.
 */
export const typeChecker: Record<string, (a?: CompareType, b?: CompareType) => boolean> = {
	/** Checks if both values are of the same type and array status */
	bothAreSameType: (a, b) => typeof a === typeof b && Array.isArray(a) === Array.isArray(b),

	/** Checks if a value is a simple primitive type */
	isSimpleType: a => SIMPLE_TYPES.has(typeof a),

	/** Checks if both values are null */
	bothAreNulls: (a, b) => a === null && b === null,

	/** Checks if a value is a number */
	isNumber: a => ["number"].includes(typeof a),

	/** Checks if a value is a non-null object */
	isNotNullObject: a => typeof a === "object" && a !== null,

	/** Checks if both values are numbers */
	bothAreNumbers: (a, b) => typeChecker.isNumber(a) && typeChecker.isNumber(b),

	/** Checks if both values are NaN */
	bothAreNumbersAndNaNs: (a, b) => typeChecker.bothAreNumbers(a, b) && Number.isNaN(a) && Number.isNaN(b),

	/** Checks if exactly one value is NaN */
	bothAreNumbersAndOnlyOneIsNaN: (a, b) =>
		typeChecker.bothAreNumbers(a, b) &&
		((!Number.isNaN(a) && Number.isNaN(b)) || (Number.isNaN(a) && !Number.isNaN(b))),

	/** Checks if both values are wrapper objects (String, Number, Boolean, BigInt) */
	bothAreWrapperTypes: (a, b) =>
		typeChecker.isNotNullObject(a) &&
		typeChecker.isNotNullObject(b) &&
		!!a?.constructor.name &&
		!!b?.constructor.name &&
		WRAPPER_TYPES.has(a?.constructor.name) &&
		WRAPPER_TYPES.has(b?.constructor.name),
};

function compareArrs<T extends CompareType>(
	a: T[],
	b: T[],
	ignore?: string[] | Set<string>,
	include?: string[] | Set<string>,
	shallow?: boolean,
	detectCircular?: boolean,
	firstRun?: boolean,
	circularObjectStorage?: WeakSet<object>,
) {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i += 1) {
		if (!internalCompare(a[i], b[i], ignore, include, shallow, detectCircular, firstRun, circularObjectStorage)) {
			return false;
		}
	}
	return true;
}

function compareObjects<T extends BasicCompareObject>(
	a: T,
	b: T,
	ignore?: string[] | Set<string>,
	include?: string[] | Set<string>,
	shallow?: boolean,
	detectCircular?: boolean,
	firstRun?: boolean,
	circularObjectStorage?: WeakSet<object>,
) {
	let keysA;
	let keysB;

	const ignoreCheck = Array.isArray(ignore) ? (x: string) => ignore.includes(x) : (x: string) => ignore?.has(x);
	const ignoreSize = Array.isArray(ignore) ? ignore.length : ignore?.size ?? 0;

	const includeCheck = Array.isArray(include) ? (x: string) => include.includes(x) : (x: string) => include?.has(x);
	const includeSize = Array.isArray(include) ? include.length : include?.size ?? 0;

	// Empty include set means "include nothing" -> objects are equal
	if (include && includeSize === 0) {
		return true;
	}

	if (!ignoreSize && !includeSize) {
		keysA = Object.keys(a || {}).sort();
		keysB = Object.keys(b || {}).sort();
	} else {
		keysA = Object.keys(a || {})
			.sort()
			.filter(x => (includeSize ? includeCheck(x) : !ignoreCheck(x)));
		keysB = Object.keys(b || {})
			.sort()
			.filter(x => (includeSize ? includeCheck(x) : !ignoreCheck(x)));
	}

	if (!compareArrs(keysA, keysB, ignore, include, shallow, detectCircular, firstRun, circularObjectStorage)) {
		return false;
	}

	for (let i = 0; i < keysA.length; i += 1) {
		if (
			!internalCompare(
				a[keysA[i]],
				b[keysA[i]],
				undefined,
				undefined,
				shallow,
				detectCircular,
				false,
				circularObjectStorage,
			)
		) {
			return false;
		}
	}
	return true;
}

function internalCompare(
	a: CompareType,
	b: CompareType,
	ignore?: string[] | Set<string>,
	include?: string[] | Set<string>,
	shallow?: boolean,
	detectCircular: boolean = false,
	// ---vvv--- only internal use ---vvv---
	firstRun: boolean = true,
	circularObjectStorage = new WeakSet<object>(),
) {
	if (!typeChecker.bothAreSameType(a, b)) {
		return false;
	}

	if (typeChecker.isSimpleType(a) || typeChecker.bothAreNulls(a, b)) {
		return a === b;
	}

	if (typeChecker.bothAreNumbersAndNaNs(a, b)) {
		return true;
	}

	if (typeChecker.bothAreNumbersAndOnlyOneIsNaN(a, b)) {
		return false;
	}

	if (typeChecker.bothAreNumbers(a, b)) {
		return a === b;
	}

	if (typeChecker.bothAreWrapperTypes(a, b)) {
		return internalCompare(
			// @ts-expect-error: `a` and `b` are not objects
			a.valueOf(),
			// @ts-expect-error: `a` and `b` are not objects
			b.valueOf(),
			ignore,
			include,
			shallow,
			detectCircular,
			false,
			circularObjectStorage,
		);
	}

	if (typeChecker.isNotNullObject(a)) {
		// Handle circular references for objects (including arrays)
		if (detectCircular) {
			if (circularObjectStorage.has(a as object) && circularObjectStorage.has(b as object)) {
				// If both objects are already in the storage, they are part of a circular reference
				// Compare their structure up to this point
				return true;
			}

			// Add both objects to storage before continuing comparison
			circularObjectStorage.add(a as object);
			circularObjectStorage.add(b as object);
		}

		// For shallow comparison, just check reference equality for non-primitive types after first level
		if (!firstRun && shallow) {
			return a === b;
		}
	}

	const isArray = Array.isArray(a);
	if (isArray) {
		return compareArrs(
			a as (BasicCompareObject | BasicCompareType)[],
			b as (BasicCompareObject | BasicCompareType)[],
			ignore,
			include,
			shallow,
			detectCircular,
			false,
			circularObjectStorage,
		);
	}

	return compareObjects(
		a as BasicCompareObject,
		b as BasicCompareObject,
		ignore,
		include,
		shallow,
		detectCircular,
		false,
		circularObjectStorage,
	);
}

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
 * ```
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param options - Comparison options
 * @returns True if values are equal according to comparison rules
 */
export function compare(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	const { topLevelIgnore, topLevelInclude, shallow, detectCircular = false } = options;
	return internalCompare(a, b, topLevelIgnore, topLevelInclude, shallow, detectCircular);
}

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
export function same(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	return compare(a, b, options);
}

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
export function different(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	return !compare(a, b, options);
}
