// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const { same } = require("../..");

// eslint-disable-next-line no-undef
test("`same` is available in Node.js runtime and works well", () => {
	expect(same([1, { a: 1 }], [1, { a: 1 }])).toBe(true);
});
