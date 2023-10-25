function compareArrs(a, b, ignore = [], include = []) {
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
function compareObjects(a, b, ignore = [], include = []) {
    let keysA;
    let keysB;
    if (!ignore.length && !include.length) {
        keysA = Object.keys(a || {}).sort();
        keysB = Object.keys(b || {}).sort();
    }
    else {
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
function internalCompare(a, b, ignore = [], include = []) {
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
    const isArray = Array.isArray(a);
    if (isArray) {
        return compareArrs(a, b, ignore, include);
    }
    return compareObjects(a, b, ignore, include);
}
/**
 * Returns true if both objects are same, false otherwise.
 * Compares simple objects, arrays or simple typed variable deeply.
 *
 * It process the simple objects which are `JSON.stringify`-able, arrays containing such objects and simple typed variables.
 * It does matter if the internal variable is set to `null` or `undefined` or if it doesn't exist at all.
 */
export function compare(a, b, options = {}) {
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
export function same(a, b, options = {}) {
    return compare(a, b, options);
}
/**
 * Returns true if both objects are different, false otherwise.
 * Compares simple objects, arrays or simple typed variable deeply.
 *
 * It process the simple objects which are `JSON.stringify`-able, arrays containing such objects and simple typed variables.
 * It does matter if the internal variable is set to `null` or `undefined` or if it doesn't exist at all.
 */
export function different(a, b, options = {}) {
    return !compare(a, b, options);
}
//# sourceMappingURL=comparator.js.map