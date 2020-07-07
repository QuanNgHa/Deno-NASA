import { join } from "https://deno.land/std/path/mod.ts";
//Buffer: holding a chunk of data for a while before reading
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
//Import lodash : Third Party Module
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

type Planet = Record<string, string>;
// interface Planet {
//   // Planet is an object with key = type of string; value = type of string
//   [key: string]: string;
// }

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter((planet) => {
    //Get Planet's radius
    const plantaryRadius = Number(planet["koi_prad"]); //Casting from string to number
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);

    return planet["koi_disposition"] === "CONFIRMED" &&
      plantaryRadius > 0.5 && plantaryRadius < 1.5 &&
      stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });
}

let planets: Array<Planet>;

async function loadPlanetsData() {
  const path = join("data", "kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });
  //rid = resourse id
  Deno.close(file.rid);

  //Filter those Habitable planets similar to the Earth
  //result as Array<Planet>: Type Assertion
  const planets = filterHabitablePlanets(result as Array<Planet>);
  //console.log(result);
  return planets.map((planet) => {
    //Using Lodash to filter only columns we want as per each planet
    return _.pick(planet, [
      "kepler_name",
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "koi_count",
      "koi_steff",
    ]);
  });
}

planets = await loadPlanetsData();
console.log(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
  return planets;
}
