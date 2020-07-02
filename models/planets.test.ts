/**
 * Deno includes:
 * 
 * 1. Test runner in CLI
 * 2. Assertions in the standard library
 * 3. Built-in test fixtures with Deno.test()
 */
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("Short Example Test", () => {
  //Check for Equality
  assertEquals("deno", "deno");
  assertNotEquals({ runtime: "deno" }, { runtime: "node" });
});

//Full Version can be add "ignore" flag
Deno.test({
  name: "Example Test",
  //Will ignore if you run this test in Windows OS
  ignore: Deno.build.os === "windows",
  fn() {
    //Check for Equality
    assertEquals("deno", "deno");
    assertNotEquals({ runtime: "deno" }, { runtime: "node" });
  },
});

Deno.test({
  name: "Ops leak",
  //Will ignore async functions which are yet to complete
  sanitizeOps: false,
  fn() {
    setTimeout(console.log, 10000);
  },
});

Deno.test({
  name: "resource leak",
  //Will ignore if resources are not matching
  sanitizeResources: false,
  async fn() {
    await Deno.open("./models/planets.ts");
  },
});
