import { compare, Comparable } from "./comparator";

class Point implements Comparable<Point> {
	constructor(
		public x: number,
		public y: number,
	) {}

	equals(other: Point): boolean {
		return this.x === other.x && this.y === other.y;
	}
}

class ComplexNumber implements Comparable<ComplexNumber> {
	constructor(
		public real: number,
		public imaginary: number,
	) {}

	equals(other: ComplexNumber): boolean {
		const identicalReal = this.real === other.real || (Number.isNaN(this.real) && Number.isNaN(other.real));
		const identicalImaginary =
			this.imaginary === other.imaginary || (Number.isNaN(this.imaginary) && Number.isNaN(other.imaginary));
		return identicalReal && identicalImaginary;
	}
}

class Person implements Comparable<Person> {
	constructor(
		public name: string,
		public age: number,
		private ssn: string, // private field should be included in comparison
	) {}

	equals(other: Person): boolean {
		return this.name === other.name && this.age === other.age && this.ssn === other.ssn;
	}
}

class Vector2D implements Comparable<Vector2D> {
	constructor(
		public x: number,
		public y: number,
	) {}

	// Custom equality that treats (1,0) and (-1,0) as equal vectors
	// (representing same direction but different magnitude)
	equals(other: Vector2D): boolean {
		if (this.x === 0 && this.y === 0) return other.x === 0 && other.y === 0;
		if (other.x === 0 && other.y === 0) return false;

		// Check if vectors point in the same or opposite direction
		return Math.abs(this.x * other.y - this.y * other.x) < Number.EPSILON;
	}
}

describe("Comparable Interface Tests", () => {
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

	describe("Point Class", () => {
		it("should compare equal points correctly", () => {
			const p1 = new Point(1, 2);
			const p2 = new Point(1, 2);
			const p3 = new Point(2, 1);

			expect(compare(p1, p2)).toBe(true);
			expect(compare(p1, p3)).toBe(false);
		});

		it("should work with arrays of points", () => {
			const points1 = [new Point(1, 1), new Point(2, 2)];
			const points2 = [new Point(1, 1), new Point(2, 2)];
			const points3 = [new Point(2, 2), new Point(1, 1)];

			expect(compare(points1, points2)).toBe(true);
			expect(compare(points1, points3)).toBe(false);
		});
	});

	describe("ComplexNumber Class", () => {
		it("should compare complex numbers correctly", () => {
			const c1 = new ComplexNumber(1, 2);
			const c2 = new ComplexNumber(1, 2);
			const c3 = new ComplexNumber(2, 1);

			expect(compare(c1, c2)).toBe(true);
			expect(compare(c1, c3)).toBe(false);
		});

		it("should handle NaN values", () => {
			const c1 = new ComplexNumber(NaN, 2);
			const c2 = new ComplexNumber(NaN, 2);
			const c3 = new ComplexNumber(1, NaN);

			expect(compare(c1, c2)).toBe(true);
			expect(compare(c1, c3)).toBe(false);
		});
	});

	describe("Person Class", () => {
		it("should compare people with private fields", () => {
			const p1 = new Person("John", 30, "123-45-6789");
			const p2 = new Person("John", 30, "123-45-6789");
			const p3 = new Person("John", 30, "987-65-4321");

			expect(compare(p1, p2)).toBe(true);
			expect(compare(p1, p3)).toBe(false);
		});

		it("should work with nested objects containing comparable objects", () => {
			const obj1 = {
				person: new Person("John", 30, "123-45-6789"),
				location: new Point(1, 2),
			};
			const obj2 = {
				person: new Person("John", 30, "123-45-6789"),
				location: new Point(1, 2),
			};
			const obj3 = {
				person: new Person("John", 30, "987-65-4321"),
				location: new Point(1, 2),
			};

			expect(compare(obj1, obj2)).toBe(true);
			expect(compare(obj1, obj3)).toBe(false);
		});
	});

	describe("Vector2D Class with Custom Equality", () => {
		it("should use equals() method instead of property comparison", () => {
			const v1 = new Vector2D(1, 0);
			const v2 = new Vector2D(-1, 0); // Same direction as v1, different magnitude
			const v3 = new Vector2D(0, 1); // Different direction

			// These vectors should be equal according to equals() method
			// but have different property values
			expect(v1.equals(v2)).toBe(true);
			expect(compare(v1, v2)).toBe(true); // This will fail until equals() is used

			expect(v1.equals(v3)).toBe(false);
			expect(compare(v1, v3)).toBe(false);
		});

		it("should handle zero vector specially", () => {
			const zero = new Vector2D(0, 0);
			const v1 = new Vector2D(0, 0);
			const v2 = new Vector2D(1, 0);

			expect(zero.equals(v1)).toBe(true);
			expect(compare(zero, v1)).toBe(true); // This will pass (but for wrong reason)

			expect(zero.equals(v2)).toBe(false);
			expect(compare(zero, v2)).toBe(false);
		});

		it("should work with arrays of vectors", () => {
			const arr1 = [new Vector2D(1, 0), new Vector2D(0, 1)];
			const arr2 = [new Vector2D(-1, 0), new Vector2D(0, 1)]; // First vector points same direction

			// Arrays should be equal because their corresponding vectors are equal
			// according to the custom equality
			expect(compare(arr1, arr2)).toBe(true); // This will fail until equals() is used
		});

		it("should work with nested objects containing vectors", () => {
			const obj1 = {
				direction: new Vector2D(2, 0),
				magnitude: 2,
			};
			const obj2 = {
				direction: new Vector2D(-4, 0), // Same direction, different magnitude
				magnitude: 4,
			};

			// Objects should be equal because their vectors point in same direction
			// despite having different magnitudes
			expect(compare(obj1, obj2, { topLevelIgnore: ["magnitude"] })).toBe(true); // This will fail until equals() is used
		});
	});

	describe("Mixed Comparable and Non-Comparable Objects", () => {
		// Regular object that looks like Point but doesn't implement Comparable
		const plainPoint = {
			x: 1,
			y: 2,
		};

		// Point that implements Comparable
		const comparablePoint = new Point(1, 2);

		it("should handle when only one object implements Comparable - identical values", () => {
			// Even though plainPoint doesn't implement Comparable,
			// the objects should still be equal because their properties match
			expect(compare(plainPoint, comparablePoint)).toBe(true);
			expect(compare(comparablePoint, plainPoint)).toBe(true);
		});

		it("should handle when only one object implements Comparable - different values", () => {
			const differentPlainPoint = { x: 1, y: 3 };
			const differentComparablePoint = new Point(1, 3);

			expect(compare(plainPoint, differentComparablePoint)).toBe(false);
			expect(compare(comparablePoint, differentPlainPoint)).toBe(false);
		});

		it("should handle complex cases with custom equality", () => {
			// Regular object that looks like Vector2D
			const plainVector = { x: 1, y: 0 };
			// Vector2D with custom equality that considers direction only
			const comparableVector = new Vector2D(1, 0);
			const oppositeVector = new Vector2D(-1, 0);

			// Plain object comparison should use property equality
			expect(compare(plainVector, comparableVector)).toBe(true);
			expect(compare(plainVector, oppositeVector)).toBe(false);

			// When Comparable object is first, it should still use property equality
			expect(compare(comparableVector, plainVector)).toBe(true);
			expect(compare(oppositeVector, plainVector)).toBe(false);
		});

		it("should handle arrays with mixed comparable and non-comparable objects", () => {
			const arr1 = [plainPoint, new Point(3, 4)];
			const arr2 = [new Point(1, 2), { x: 3, y: 4 }];

			expect(compare(arr1, arr2)).toBe(true);
		});

		it("should handle nested objects with mixed comparable and non-comparable objects", () => {
			const nested1 = {
				point: plainPoint,
				vector: new Vector2D(1, 0),
			};
			const nested2 = {
				point: new Point(1, 2),
				vector: { x: 1, y: 0 },
			};

			expect(compare(nested1, nested2)).toBe(true);
		});
	});

	describe("Object.keys() and Methods", () => {
		class TestClass {
			constructor(public x: number) {}

			public someMethod() {
				return this.x;
			}
			public get someGetter() {
				return this.x;
			}
			public set someSetter(v: number) {
				this.x = v;
			}
		}

		it("should demonstrate that methods are not enumerable", () => {
			const instance = new TestClass(42);
			const plainObject = { x: 42 };

			// Object.keys only shows 'x', not methods or accessors
			expect(Object.keys(instance)).toEqual(["x"]);
			expect(Object.keys(plainObject)).toEqual(["x"]);

			// Methods and accessors exist but aren't enumerable
			expect(instance.someMethod).toBeDefined();
			expect(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(instance), "someMethod")?.enumerable).toBe(
				false,
			);

			// The objects should be equal in comparison because only enumerable properties are compared
			expect(compare(instance as any, plainObject)).toBe(true);
		});
	});
});
