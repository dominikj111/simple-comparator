import { compare } from "../src/comparator";

describe("Shallow Comparison", () => {
	it("Should support shallow comparison", () => {
		const nestedObj = { x: 1, y: 2 };
		const obj1 = {
			a: 1,
			b: "test",
			c: nestedObj,
			d: [1, 2, 3],
		};
		const obj2 = {
			a: 1,
			b: "test",
			c: { x: 1, y: 2 }, // Same content but different reference
			d: [1, 2, 3], // Same content but different reference
		};
		const obj3 = {
			a: 1,
			b: "test",
			c: nestedObj, // Same reference
			d: [1, 2, 3], // Different reference
		};

		// Deep comparison (default)
		expect(compare(obj1, obj2)).toBeTruthy();

		// Shallow comparison
		expect(compare(obj1, obj2, { shallow: true })).toBeFalsy(); // Different references for c and d
		expect(compare(obj1, obj3, { shallow: true })).toBeFalsy(); // Same reference for c, different for d

		// Shallow with same references
		const obj4 = { ...obj1 }; // Shallow copy
		expect(compare(obj1, obj4, { shallow: true })).toBeTruthy();
	});

	it("Should handle shallow comparison with arrays", () => {
		const arr1 = [1, 2];
		const obj1 = { arr: arr1, num: 1 };
		const obj2 = { arr: [1, 2], num: 1 }; // Different array reference
		const obj3 = { arr: arr1, num: 1 }; // Same array reference

		// Deep comparison (default)
		expect(compare(obj1, obj2)).toBeTruthy();

		// Shallow comparison
		expect(compare(obj1, obj2, { shallow: true })).toBeFalsy(); // Different array reference
		expect(compare(obj1, obj3, { shallow: true })).toBeTruthy(); // Same array reference
	});

	it("Should combine shallow comparison with include/ignore options", () => {
		const arr1 = [1, 2];
		const obj1 = {
			arr: arr1,
			num: 1,
			str: "test",
		};
		const obj2 = {
			arr: [1, 2], // Different reference
			num: 1,
			str: "test",
		};

		// Shallow comparison ignoring arr
		expect(
			compare(obj1, obj2, {
				shallow: true,
				topLevelIgnore: new Set(["arr"]),
			}),
		).toBeTruthy();

		// Shallow comparison including only primitive fields
		expect(
			compare(obj1, obj2, {
				shallow: true,
				topLevelInclude: new Set(["num", "str"]),
			}),
		).toBeTruthy();
	});

	it("Should handle shallow comparison of top-level arrays", () => {
		const arr1 = [1, 2, { x: 1 }];
		const arr2 = [1, 2, { x: 1 }]; // Same content, different reference
		const arr3 = arr1; // Same reference

		// Deep comparison (default)
		expect(compare(arr1, arr2)).toBeTruthy();

		// Shallow comparison
		expect(compare(arr1, arr2, { shallow: true })).toBeFalsy(); // Different array reference
		expect(compare(arr1, arr3, { shallow: true })).toBeTruthy(); // Same array reference

		// Nested arrays
		const nested1 = [
			[1, 2],
			[3, 4],
		];
		const nested2 = [
			[1, 2],
			[3, 4],
		]; // Different references

		expect(compare(nested1, nested2)).toBeTruthy(); // Deep comparison
		expect(compare(nested1, nested2, { shallow: true })).toBeFalsy(); // Shallow - different references

		// Nested arrays
		const nested11 = [
			[1, 2],
			[3, 4],
		];
		const nested22 = [nested11[0], nested11[1]];

		expect(compare(nested11, nested22, { shallow: true })).toBeTruthy();
		expect(compare(nested11, [...nested22], { shallow: true })).toBeTruthy();
		expect(compare(nested11, [...nested22])).toBeTruthy();
	});
});
