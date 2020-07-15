import {
  join,
  BufReader, //Buffer: holding a chunk of data for a while before reading
  parse,
  pick, //Import lodash : Third Party Module
  log,
} from "../deps.ts";

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
  //current Path follows mod.ts
  const path = join("data", "kepler_exoplanets_nasa.csv");
  log.info(path);

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
  //log.info(result);
  return planets.map((planet) => {
    //Using Lodash to filter only columns we want as per each planet
    return pick(planet, [
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
log.info(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
  return planets;
}
