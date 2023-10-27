import { compare, same, different, Comparable } from "./comparator";

describe("`compare` function tests", () => {
	it("Compares multi typed arrays", () => {
		expect(compare([1, 2, 3], [1, 2, 3])).toBeTruthy();
		expect(compare([1, 3, 2], [1, 2, 3])).toBeFalsy();
		expect(compare([1, 2], [1, 2, 3])).toBeFalsy();
		expect(compare([1, 2, "3"], [1, 2, 3])).toBeFalsy();
		expect(compare([1, "2", 3], [1, "2", 3])).toBeTruthy();
		expect(compare([], [])).toBeTruthy();
		expect(compare(["1", "2", null], ["1", "2", null])).toBeTruthy();
		expect(compare([undefined, "2", null], [undefined, "2", null])).toBeTruthy();
		expect(compare([undefined, "2", Number.NaN], [undefined, "2", NaN])).toBeTruthy();
		expect(compare([undefined, "2", Number.NaN], [undefined, "2", Number.NaN])).toBeTruthy();
		expect(compare([undefined, "2", Number.NaN], [undefined, "2"])).toBeFalsy();
	});

	it("Compares by `JSON.stringify` serialize-able objects", () => {
		expect(compare({}, {})).toBeTruthy();
		expect(compare({ a: 1, b: "aa" }, { a: 1, b: "aa" })).toBeTruthy();
		expect(compare({ a: 1, b: "aa" }, { b: "aa", a: 1 })).toBeTruthy();
		expect(compare({ a: 1, b: ["aa", 1] }, { b: ["aa", 1], a: 1 })).toBeTruthy();
		expect(compare({ a: 1, b: ["aa", 1] }, { b: ["aa", 2], a: 1 })).toBeFalsy();
		expect(compare({ a: 1, b: ["aa", 1] }, null)).toBeFalsy();
		expect(compare({ a: 1, b: ["aa", 1] }, undefined)).toBeFalsy();
		expect(compare({ a: 1, b: ["aa", 1] }, {})).toBeFalsy();
	});

	it("Compares simple typed variables", () => {
		expect(compare(4, 1)).toBeFalsy();
		expect(compare(NaN, Number.NaN)).toBeTruthy();
		expect(compare(undefined, null)).toBeFalsy();
		expect(compare("", "")).toBeTruthy();
	});

	it("Compares undefined/null/NaN", () => {
		const a = {
			a: false,
			b: undefined,
			c: false,
			d: null,
			e: 1,
			i: Number.NaN,
		};
		const b = {
			a: false,
			b: undefined,
			c: false,
			d: null,
			e: 2,
			i: Number.NaN,
		};
		expect(compare(a, b, { topLevelInclude: ["a", "b", "c", "d"] })).toBeTruthy();
		expect(compare(a, b, { topLevelInclude: ["a", "b", "e"] })).toBeFalsy();

		const c = {
			a: false,
			b: undefined,
			c: "undefined",
			g: null,
			d: false,
			e: 1,
		};
		const d = {
			a: false,
			b: undefined,
			c: "undefined",
			g: null,
			d: false,
			e: 1,
		};
		expect(compare(c, d)).toBeTruthy();
		expect(compare(c, { ...d, c: "test" })).toBeFalsy();
		expect(compare(c, { ...d, f: "test" })).toBeFalsy();
	});

	it("Compares nested objects", () => {
		expect(
			compare({ a: 1, b: [{ bb: [12, ["a", "b"]] }, 1] }, { b: [{ bb: [12, ["a", "b"]] }, 1], a: 1 }),
		).toBeTruthy();
		expect(
			compare(
				// @ts-expect-error: mixing types is ok
				[
					[null, null],
					[undefined, 1],
					[{ a: 1 }, { b: [1, 2, "3"] }],
				],
				[
					[null, null],
					[undefined, 1],
					[{ a: 1 }, { b: [1, 2, "3"] }],
				],
			),
		).toBeTruthy();
	});

	it("Compares provided objects with ignoring top level keys only", () => {
		expect(
			compare({ a: 1, b: { a: 1, b: 2 } }, { a: 2, b: { a: 1, b: 2 } }, { topLevelIgnore: ["a"] }),
		).toBeTruthy();
		expect(
			compare({ a: 1, b: { a: 1, b: 2 } }, { a: 2, b: { a: 2, b: 2 } }, { topLevelIgnore: ["a"] }),
		).toBeFalsy();
	});

	it("Allows to ignore/include top level keys", () => {
		expect(compare({ a: 1, b: ["aa", 1] }, { b: ["aa", 2], a: 1 }, { topLevelIgnore: ["b"] })).toBeTruthy();
		expect(compare({ a: 1, b: ["aa", 1] }, { b: ["aa", 2], a: 1 }, { topLevelInclude: ["b"] })).toBeFalsy();
	});

	it("Key inclusion takes precedence over ignoring", () => {
		expect(
			compare({ a: 1, b: ["aa", 1] }, { b: ["aa", 2], a: 1 }, { topLevelIgnore: ["b"], topLevelInclude: ["b"] }),
		).toBeFalsy();
	});

	it("Compares provided arrays of objects with ignoring top level keys only", () => {
		expect(
			compare(
				[
					{ a: 1, b: 2 },
					{ a: { a: 1, b: 2 }, b: { a: 1, b: 2 } },
				],
				[
					{ a: 1, b: 2 },
					{ a: { a: 1, b: 3 }, b: { a: 1, b: 2 } },
				],
				{ topLevelIgnore: ["a"] },
			),
		).toBeTruthy();

		expect(
			compare(
				[
					{ a: 1, b: 2 },
					{ a: { a: [1, 2], b: 2 }, b: { a: [1, 2], b: 2 } },
				],
				[
					{ a: 1, b: 2 },
					{ a: { a: [1, 2], b: 2 }, b: { a: [1, 3], b: 2 } },
				],
				{ topLevelIgnore: ["a"] },
			),
		).toBeFalsy();

		expect(
			compare(
				[
					{ a: 1, b: 2 },
					{ a: { a: [1, 2], b: 2 }, b: { a: [1, 2], b: 2 } },
				],
				[
					{ a: 1, b: 2 },
					{ a: { a: [1, 2], b: 2 }, b: { a: [1, 2], b: 2 } },
				],
				{ topLevelIgnore: ["a"] },
			),
		).toBeTruthy();
	});

	it("Offers same and different functions to more evident calls", () => {
		expect(same(1, 1)).toBeTruthy();
		expect(different(1, 2)).toBeTruthy();
	});

	it("Should resolve to false when comparing Number and number", () => {
		expect(compare(new Number(1), 1)).toBeFalsy();
	});

	it("Should resolve to false when comparing Boolean and boolean", () => {
		expect(compare(new Boolean(1), true)).toBeFalsy();
	});

	it("Should resolve to false when comparing String and string", () => {
		expect(compare(new String("test"), "test")).toBeFalsy();
	});

	it("Should resolve correctly when comparing Number and Number", () => {
		expect(compare(new Number(1), new Number(1))).toBeTruthy();
		expect(compare(new Number(1), new Number(2))).toBeFalsy();
	});

	it("Should resolve correctly when comparing Boolean and Boolean", () => {
		expect(compare(new Boolean(1), new Boolean(1))).toBeTruthy();
		expect(compare(new Boolean(1), new Boolean(0))).toBeFalsy();
	});

	it("Should resolve correctly true when comparing String and String", () => {
		expect(compare(new String("test"), new String("test"))).toBeTruthy();
		expect(compare(new String("test"), new String("test2"))).toBeFalsy();
	});

	it("Should resolve class objects implementing `Comparable` interface", () => {
		class SomeClass implements Comparable<SomeClass> {
			private test: string;

			constructor(test: string) {
				this.test = test;
			}

			public getTest() {
				return this.test;
			}

			equals(_: SomeClass) {
				return this.getTest() === _.getTest();
			}
		}

		const someClass1 = new SomeClass("ab");
		const someClass2 = new SomeClass("cd");
		const someClass3 = new SomeClass("ab");

		expect(compare(someClass1, someClass2)).toBe(false);
		expect(compare(someClass1, someClass3)).toBe(true);
	});
});
