/* eslint-disable no-undef, @typescript-eslint/no-require-imports */

/**
 * Packaging smoke tests: install the package the way a consumer does and exercise
 * every published entry point.
 *
 * The rest of the suite imports `../src/comparator` directly, so it stays green
 * even when the *published* package is unusable. This file closes that gap: it
 * packs the repo with `npm pack`, unpacks the tarball into a throwaway
 * `node_modules/simple-comparator`, and then runs Node and tsc against it.
 *
 * Regression net for https://github.com/dominikj111/simple-comparator/issues/1
 */

const { execFileSync } = require("node:child_process");
const { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");

const repoRoot = join(__dirname, "..");
const packageName = "simple-comparator";

let workDir;
let consumerDir;

jest.setTimeout(180000);

/** Run a command, capturing output instead of throwing — the failures are the assertions. */
function run(command, args, options = {}) {
	try {
		return {
			exitCode: 0,
			stdout: execFileSync(command, args, { encoding: "utf8", stdio: "pipe", ...options }),
			stderr: "",
		};
	} catch (error) {
		return {
			exitCode: typeof error.status === "number" ? error.status : 1,
			stdout: error.stdout ?? "",
			stderr: error.stderr ?? "",
		};
	}
}

/** Whichever stream has content: node prints runtime errors to stderr, tsc to stdout. */
function outputOf(result) {
	return (result.stdout || result.stderr).trim();
}

/**
 * Assert a command exited cleanly and printed `expectedOutput`.
 *
 * The whole result goes into the diff, so a failure shows the tool's own message
 * (e.g. `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`) instead of a generic
 * "exit code 1" — the point of this file is to make the breakage legible.
 */
function expectCommand(result, expectedOutput) {
	expect({ exitCode: result.exitCode, output: outputOf(result) }).toEqual({
		exitCode: 0,
		output: expectedOutput,
	});
}

/**
 * Type-check a consumer file against the published declarations.
 *
 * `strict` is a parameter because the published types previously pointed at
 * TypeScript source, which made the result depend on the consumer's own flags:
 * an unused `@ts-expect-error` failed in non-strict projects.
 */
function typecheck(file, { strict = false } = {}) {
	const tsc = join(repoRoot, "node_modules", "typescript", "bin", "tsc");
	if (!existsSync(tsc)) {
		throw new Error("TypeScript is not installed in this repo — run `pnpm install` before the test suite.");
	}

	return run(
		process.execPath,
		[
			tsc,
			"--noEmit",
			...(strict ? ["--strict"] : []),
			"--module",
			"nodenext",
			"--moduleResolution",
			"nodenext",
			file,
		],
		{ cwd: consumerDir },
	);
}

/** Setup failures abort the suite, so report the tool output instead of an assertion diff. */
function expectSetup(label, result) {
	if (result.exitCode !== 0) {
		throw new Error(`${label} failed with exit code ${result.exitCode}:\n${outputOf(result)}`);
	}
	return result.stdout;
}

function writeConsumerFile(name, content) {
	writeFileSync(join(consumerDir, name), content);
}

beforeAll(() => {
	workDir = mkdtempSync(join(tmpdir(), "simple-comparator-packaging-"));
	consumerDir = join(workDir, "consumer");
	mkdirSync(consumerDir, { recursive: true });

	// 1. Produce the exact file set that would be published.
	const pack = expectSetup(
		"npm pack",
		run("npm", ["pack", "--json", "--pack-destination", workDir], { cwd: repoRoot }),
	);

	// npm < 12 reports an array, npm >= 12 an object keyed by package name.
	const packed = JSON.parse(pack);
	const manifest = Array.isArray(packed) ? packed[0] : Object.values(packed)[0];
	const tarball = join(workDir, manifest.filename);

	// 2. Unpack it where npm would install it: consumer/node_modules/<name>
	const installedDir = join(consumerDir, "node_modules", packageName);
	mkdirSync(installedDir, { recursive: true });
	expectSetup("tar", run("tar", ["-xzf", tarball, "--strip-components=1", "-C", installedDir]));

	writeConsumerFile(
		"types-esm.mts",
		[
			`import { compare, same, different } from "${packageName}";`,
			"",
			"const results: boolean[] = [compare({ a: 1 }, { a: 1 }), same([1], [1]), different(1, 2)];",
			"export { results };",
			"",
		].join("\n"),
	);

	writeConsumerFile(
		"types-cjs.cts",
		[
			`import { compare, same } from "${packageName}";`,
			"",
			"const equal: boolean = compare({ a: 1 }, { a: 1 }) && same([1], [1]);",
			"export { equal };",
			"",
		].join("\n"),
	);

	// 3. A minimal modern consumer project.
	writeConsumerFile(
		"package.json",
		JSON.stringify({ name: "consumer", version: "0.0.0", private: true, type: "module" }, null, "\t"),
	);
});

afterAll(() => {
	if (workDir) {
		rmSync(workDir, { recursive: true, force: true });
	}
});

describe("published package resolves in a Node.js consumer", () => {
	it("ESM `import` loads the published entry point", () => {
		writeConsumerFile(
			"esm-check.mjs",
			[
				`import { compare, same, different } from "${packageName}";`,
				`console.log([compare({ a: 1 }, { a: 1 }), same([1], [1]), different(1, 2)].join(","));`,
				"",
			].join("\n"),
		);

		expectCommand(run(process.execPath, ["esm-check.mjs"], { cwd: consumerDir }), "true,true,true");
	});

	it("CommonJS `require` loads the published entry point", () => {
		writeConsumerFile(
			"cjs-check.cjs",
			[
				`const { compare, same, different } = require("${packageName}");`,
				`console.log([compare({ a: 1 }, { a: 1 }), same([1], [1]), different(1, 2)].join(","));`,
				"",
			].join("\n"),
		);

		expectCommand(run(process.execPath, ["cjs-check.cjs"], { cwd: consumerDir }), "true,true,true");
	});

	// The types must stand on their own: consumers compile the published
	// declarations with their own flags, so a `.ts` types entry would leak our
	// source -- and its `@ts-expect-error` directives -- into their build.
	it("type-checks an ESM consumer with `strict`", () => {
		expectCommand(typecheck("types-esm.mts", { strict: true }), "");
	});

	it("type-checks an ESM consumer without `strict`", () => {
		expectCommand(typecheck("types-esm.mts"), "");
	});

	it("type-checks a CommonJS consumer", () => {
		expectCommand(typecheck("types-cjs.cts"), "");
	});
});
