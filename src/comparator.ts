/**
 * Options for `compare` function.
 *
 * topLevelIgnore - is an array of keys which should be ignored on top level of the provided object or top level of any provided object in an array.
 * topLevelInclude - is an array of keys which should be compared each other on top level of the provided object or top level of any provided object in an array.
 */
export interface CompareOptions {
	topLevelIgnore?: string[];
	topLevelInclude?: string[];
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

function compareArrs<T extends CompareType>(a: T[], b: T[], ignore: string[] = [], include: string[] = []) {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i += 1) {
		if (!internalCompare(a[i], b[i], ignore, include)) {
			return false;
		}
	}
	return true;
}

function compareObjects<T extends BasicCompareObject>(a: T, b: T, ignore: string[] = [], include: string[] = []) {
	let keysA;
	let keysB;

	if (!ignore.length && !include.length) {
		keysA = Object.keys(a || {}).sort();
		keysB = Object.keys(b || {}).sort();
	} else {
		keysA = Object.keys(a || {})
			.sort()
			.filter(x => (include.length ? include.includes(x) : !ignore.includes(x)));
		keysB = Object.keys(b || {})
			.sort()
			.filter(x => (include.length ? include.includes(x) : !ignore.includes(x)));
	}

	if (!compareArrs(keysA, keysB)) {
		return false;
	}
	for (let i = 0; i < keysA.length; i += 1) {
		if (!internalCompare(a[keysA[i]], b[keysA[i]])) {
			return false;
		}
	}
	return true;
}

function internalCompare(a: CompareType, b: CompareType, ignore: string[] = [], include: string[] = []) {
	const isSameType = typeof a === typeof b && Array.isArray(a) === Array.isArray(b);
	if (!isSameType) {
		return false;
	}

	const isSimpleType = ["string", "boolean", "undefined"].includes(typeof a);
	if (isSimpleType || (a === null && b === null)) {
		return a === b;
	}

	const isNumber = ["number"].includes(typeof a);
	if (isNumber) {
		if (Number.isNaN(a) && Number.isNaN(b)) {
			return true;
		}
		if ((!Number.isNaN(a) && Number.isNaN(b)) || (Number.isNaN(a) && !Number.isNaN(b))) {
			return false;
		}
		return a === b;
	}

	if (a?.constructor.name && b?.constructor.name) {
		const AIsSimpleWrapper = ["String", "Number", "Boolean", "BigInt"].includes(a?.constructor.name);
		const BIsSimpleWrapper = ["String", "Number", "Boolean", "BigInt"].includes(b?.constructor.name);

		if (AIsSimpleWrapper && BIsSimpleWrapper) {
			// @ts-expect-error: `a` and `b` are not objects
			return internalCompare(a.valueOf(), b.valueOf(), ignore, include);
		}
	}

	const isArray = Array.isArray(a);
	if (isArray) {
		return compareArrs(
			a as (BasicCompareObject | BasicCompareType)[],
			b as (BasicCompareObject | BasicCompareType)[],
			ignore,
			include,
		);
	}

	return compareObjects(a as BasicCompareObject, b as BasicCompareObject, ignore, include);
}

/**
 * Returns true if both objects are same, false otherwise.
 * Compares simple objects, arrays or simple typed variable deeply.
 *
 * It process the simple objects which are `JSON.stringify`-able, arrays containing such objects and simple typed variables.
 * It does matter if the internal variable is set to `null` or `undefined` or if it doesn't exist at all.
 */
export function compare(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	const { topLevelIgnore = [], topLevelInclude = [] } = options;
	return internalCompare(a, b, topLevelIgnore, topLevelInclude);
}

/**
 * Returns true if both objects are same, false otherwise.
 * Compares simple objects, arrays or simple typed variable deeply.
 *
 * It process the simple objects which are `JSON.stringify`-able, arrays containing such objects and simple typed variables.
 * It does matter if the internal variable is set to `null` or `undefined` or if it doesn't exist at all.
 */
export function same(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	return compare(a, b, options);
}

/**
 * Returns true if both objects are different, false otherwise.
 * Compares simple objects, arrays or simple typed variable deeply.
 *
 * It process the simple objects which are `JSON.stringify`-able, arrays containing such objects and simple typed variables.
 * It does matter if the internal variable is set to `null` or `undefined` or if it doesn't exist at all.
 */
export function different(a: CompareType, b: CompareType, options: CompareOptions = {}) {
	return !compare(a, b, options);
}
