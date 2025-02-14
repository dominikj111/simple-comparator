import { assertEquals } from "https://deno.land/std@0.203.0/assert/assert_equals.ts";
import { same } from "../mod.js";

// eslint-disable-next-line no-undef
Deno.test("`same` is available in Deno runtime as JS and works well", async () => {
	assertEquals(same([1, { a: 1 }], [1, { a: 1 }]), true);
});
