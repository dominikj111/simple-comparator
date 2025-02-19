/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { assertEquals } from "https://deno.land/std@0.203.0/assert/assert_equals.ts";
import { same } from "../../mod.ts";

Deno.test("`same` is available in Deno runtime as TS and works well", async () => {
	assertEquals(same([1, { a: 1 }], [1, { a: 1 }]), true);
});
