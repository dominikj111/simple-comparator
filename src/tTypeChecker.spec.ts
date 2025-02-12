import { typeChecker } from "./comparator";

describe("Type Checker tests", () => {
	describe("isSimpleType", () => {
		it("should identify simple types", () => {
			expect(typeChecker.isSimpleType("string")).toBeTruthy();
			expect(typeChecker.isSimpleType(true)).toBeTruthy();
			expect(typeChecker.isSimpleType(undefined)).toBeTruthy();
		});

		it("should reject non-simple types", () => {
			expect(typeChecker.isSimpleType({})).toBeFalsy();
			expect(typeChecker.isSimpleType([])).toBeFalsy();
			expect(typeChecker.isSimpleType(null)).toBeFalsy();
			expect(typeChecker.isSimpleType(42)).toBeFalsy();
		});
	});

	describe("bothAreNulls", () => {
		it("should identify when both values are null", () => {
			expect(typeChecker.bothAreNulls(null, null)).toBeTruthy();
		});

		it("should reject when values are not both null", () => {
			expect(typeChecker.bothAreNulls(null, undefined)).toBeFalsy();
			expect(typeChecker.bothAreNulls(undefined, null)).toBeFalsy();
			expect(typeChecker.bothAreNulls({}, null)).toBeFalsy();
		});
	});

	describe("isNumber", () => {
		it("should identify numbers", () => {
			expect(typeChecker.isNumber(42)).toBeTruthy();
			expect(typeChecker.isNumber(0)).toBeTruthy();
			expect(typeChecker.isNumber(-1)).toBeTruthy();
			expect(typeChecker.isNumber(NaN)).toBeTruthy();
		});

		it("should reject non-numbers", () => {
			expect(typeChecker.isNumber("42")).toBeFalsy();
			expect(typeChecker.isNumber(null)).toBeFalsy();
			expect(typeChecker.isNumber(undefined)).toBeFalsy();
			expect(typeChecker.isNumber({})).toBeFalsy();
		});
	});

	describe("bothAreNumbersAndNaNs", () => {
		it("should identify when both values are NaN", () => {
			expect(typeChecker.bothAreNumbersAndNaNs(NaN, NaN)).toBeTruthy();
		});

		it("should reject when values are not both NaN", () => {
			expect(typeChecker.bothAreNumbersAndNaNs(NaN, 42)).toBeFalsy();
			expect(typeChecker.bothAreNumbersAndNaNs(42, NaN)).toBeFalsy();
			expect(typeChecker.bothAreNumbersAndNaNs(42, 42)).toBeFalsy();
		});
	});

	describe("bothAreWrapperTypes", () => {
		it("should identify wrapper types", () => {
			expect(typeChecker.bothAreWrapperTypes(new String("test"), new String("test"))).toBeTruthy();
			expect(typeChecker.bothAreWrapperTypes(new Number(42), new Number(42))).toBeTruthy();
			expect(typeChecker.bothAreWrapperTypes(new Boolean(true), new Boolean(false))).toBeTruthy();
		});

		it("should reject non-wrapper types", () => {
			expect(typeChecker.bothAreWrapperTypes("test", "test")).toBeFalsy();
			expect(typeChecker.bothAreWrapperTypes(42, 42)).toBeFalsy();
			expect(typeChecker.bothAreWrapperTypes(true, false)).toBeFalsy();
		});
	});
});
