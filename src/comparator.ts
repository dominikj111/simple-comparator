const WRAPPER_TYPES = new Set(["String", "Number", "Boolean", "BigInt"]);
const SIMPLE_TYPES = new Set(["string", "boolean", "undefined"]);

/**
 * Options for `compare` function.
 *
 * @param topLevelIgnore - Array or Set of keys to ignore on top level of the provided object or top level of any provided object in an array.
 * @param topLevelInclude - Array or Set of keys to compare. If provided, only these keys will be compared. An empty Set means "include nothing".
 * @param shallow - If true, performs shallow comparison. For objects and arrays after the first level, only references are compared instead of their contents.
 * @param detectCircular - If true, detects circular references. If false, returns false when a circular reference is detected.
 */
export interface CompareOptions {
	topLevelIgnore?: string[] | Set<string>;
	topLevelInclude?: string[] | Set<string>;
	shallow?: boolean;
	detectCircular?: boolean;
}

/**
 * Comparable interface for `compare` function.
 * If class object passed to `compare` function, it should implement this interface.
 */
export interface Comparable<T> {
	equals: (_: T) => boolean;
}

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

export type BasicCompareType = SimpleTypedVariable | SimpleTypedVariable[];

export interface BasicCompareObject {
	[key: string]: BasicCompareObject | BasicCompareType | (BasicCompareObject | BasicCompareType)[];
}

export type CompareType = BasicCompareObject | BasicCompareType | (BasicCompareObject | BasicCompareType)[];

export const typeChecker: Record<string, (a?: CompareType, b?: CompareType) => boolean> = {
	bothAreSameType: (a, b) => typeof a === typeof b && Array.isArray(a) === Array.isArray(b),
	isSimpleType: a => SIMPLE_TYPES.has(typeof a),
	bothAreNulls: (a, b) => a === null && b === null,
	isNumber: a => ["number"].includes(typeof a),
	isNotNullObject: a => typeof a === "object" && a !== null,
	bothAreNumbers: (a, b) => typeChecker.isNumber(a) && typeChecker.isNumber(b),
	bothAreNumbersAndNaNs: (a, b) => typeChecker.bothAreNumbers(a, b) && Number.isNaN(a) && Number.isNaN(b),
	bothAreNumbersAndOnlyOneIsNaN: (a, b) =>
		typeChecker.bothAreNumbers(a, b) &&
		((!Number.isNaN(a) && Number.isNaN(b)) || (Number.isNaN(a) && !Number.isNaN(b))),
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
 * Returns true if both objects are same, false otherwise.
 * Compares simple objects, arrays or simple typed variables.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param options - Comparison options
 * @param options.topLevelIgnore - Array or Set of keys to ignore in comparison
 * @param options.topLevelInclude - Array or Set of keys to include in comparison. Empty Set means "include nothing"
 * @param options.shallow - If true, performs shallow comparison after first level
 * @param options.detectCircular - If true, detects circular references. If false, returns false when a circular reference is detected.
 * @returns boolean - True if objects are equal according to comparison rules
 *
 * Notes:
 * - Processes JSON-stringifiable objects, arrays, and simple typed variables
 * - Handles null/undefined/NaN comparisons
 * - Supports wrapper objects (String, Number, Boolean, BigInt)
 * - For shallow comparison, only the first level is deeply compared
 */
export function compare(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	const { topLevelIgnore, topLevelInclude, shallow, detectCircular = false } = options;
	return internalCompare(a, b, topLevelIgnore, topLevelInclude, shallow, detectCircular);
}

/**
 * Returns true if both objects are same, false otherwise.
 * Compares simple objects, arrays or simple typed variables.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param options - Comparison options
 * @param options.topLevelIgnore - Array or Set of keys to ignore in comparison
 * @param options.topLevelInclude - Array or Set of keys to include in comparison. Empty Set means "include nothing"
 * @param options.shallow - If true, performs shallow comparison after first level
 * @param options.detectCircular - If true, detects circular references. If false, returns false when a circular reference is detected.
 * @returns boolean - True if objects are equal according to comparison rules
 *
 * Notes:
 * - Processes JSON-stringifiable objects, arrays, and simple typed variables
 * - Handles null/undefined/NaN comparisons
 * - Supports wrapper objects (String, Number, Boolean, BigInt)
 * - For shallow comparison, only the first level is deeply compared
 */
export function same(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	return compare(a, b, options);
}

/**
 * Returns true if both objects are different, false otherwise.
 * Compares simple objects, arrays or simple typed variables.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param options - Comparison options
 * @param options.topLevelIgnore - Array or Set of keys to ignore in comparison
 * @param options.topLevelInclude - Array or Set of keys to include in comparison. Empty Set means "include nothing"
 * @param options.shallow - If true, performs shallow comparison after first level
 * @param options.detectCircular - If true, detects circular references. If false, returns false when a circular reference is detected.
 * @returns boolean - True if objects are different according to comparison rules
 *
 * Notes:
 * - Processes JSON-stringifiable objects, arrays, and simple typed variables
 * - Handles null/undefined/NaN comparisons
 * - Supports wrapper objects (String, Number, Boolean, BigInt)
 * - For shallow comparison, only the first level is deeply compared
 */
export function different(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	return !compare(a, b, options);
}
