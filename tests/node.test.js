// eslint-disable-next-line @typescript-eslint/no-var-requires
const { same } = require("..");

test("`same` is available in Node.js runtime and works well", () => {
	expect(same([1, { a: 1 }], [1, { a: 1 }])).toBe(true);
});
