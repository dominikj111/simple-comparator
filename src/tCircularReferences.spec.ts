import { compare } from "./comparator";

describe("Circular References", () => {
	it("Should handle circular references when detectCircular is true", () => {
		const obj1: any = { a: 1 };
		obj1.self = obj1;

		const obj2: any = { a: 1 };
		obj2.self = obj2;

		// Objects with same structure should be equal
		expect(compare(obj1, obj2, { detectCircular: true })).toBeTruthy();

		// Different circular structures should not be equal
		const obj3: any = { a: 2 };
		obj3.self = obj3;
		expect(compare(obj1, obj3, { detectCircular: true })).toBeFalsy();

		// Nested circular references
		const nested1: any = { a: { b: {} } };
		nested1.a.b.c = nested1;

		const nested2: any = { a: { b: {} } };
		nested2.a.b.c = nested2;

		expect(compare(nested1, nested2, { detectCircular: true })).toBeTruthy();

		// Array with circular references
		const arr1: any[] = [1, 2];
		arr1.push(arr1);

		const arr2: any[] = [1, 2];
		arr2.push(arr2);

		expect(compare(arr1, arr2, { detectCircular: true })).toBeTruthy();

		// Mixed circular and non-circular
		const mixed1: any = { normal: "value", circular: null };
		mixed1.circular = mixed1;

		const mixed2: any = { normal: "different", circular: null };
		mixed2.circular = mixed2;

		expect(compare(mixed1, mixed2, { detectCircular: true })).toBeFalsy();
	});

	it("Should handle circular references as errors when detectCircular is false", () => {
		const obj1: any = { a: 1 };
		obj1.self = obj1;

		const obj2: any = { a: 1 };
		obj2.self = obj2;

		// Without detectCircular, it should return false
		expect(() => compare(obj1, obj2, { detectCircular: false })).toThrow();
	});
});
