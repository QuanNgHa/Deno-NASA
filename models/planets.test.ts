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

import { filterHabitablePlanets } from "./planets.ts";

const HABITABLE_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1",
};

const NOT_CONFIRMED = {
  koi_disposition: "FALSE POSITIVE",
};

const TOO_LARGE_PLANETARY_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1.5",
  koi_srad: "1",
  koi_smass: "1",
};

const TOO_LARGE_SOLAR_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1.01",
  koi_smass: "1",
};

const TOO_LARGE_SOLAR_MASS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1.04",
};

Deno.test("filter only habitable planets", () => {
  //Check for Equality
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    NOT_CONFIRMED,
    TOO_LARGE_PLANETARY_RADIUS,
    TOO_LARGE_SOLAR_RADIUS,
    TOO_LARGE_SOLAR_MASS,
  ]);

  assertEquals(filtered, [HABITABLE_PLANET]);
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
  //Will ignore if resources are BEFORE & AFTER testing not matching
  sanitizeResources: false,
  async fn() {
    await Deno.open("./models/planets.ts");
  },
});
