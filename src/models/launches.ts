import { log, flatMap } from "../deps.ts";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean; //? means optional, not always required in Launch interface
  target?: string;
}

const launches = new Map<number, Launch>();

async function downloadLaunchData() {
  log.info("Downloading launch data...");
  const response = await fetch("https://api.spacexdata.com/v3/launches", {
    method: "GET",
  });

  if (!response.ok) {
    log.warning("Problem downloading launch data.");
    throw new Error("Launch data download failed.");
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = flatMap(payloads, (payload: any) => {
      return payload["customers"];
    });

    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      customers,
    };

    launches.set(flightData.flightNumber, flightData);
  }
}

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

//Data access function to get all launches
export function getAll() {
  //Return list of values in lauches map
  return Array.from(launches.values());
}

export function getOne(id: number) {
  if (launches.has(id)) {
    //Querry the lauches Map which has flightNumber (id) as key
    return launches.get(id);
  }
  return null;
}

export function removeOne(id: number) {
  const aborted = launches.get(id);
  //if (aborted) = we can find this launch in launches
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
}

export function addOne(data: Launch) {
  launches.set(
    data.flightNumber,
    //Object.assign(data object, additional fields you want to add)
    Object.assign(data, {
      upcoming: true,
      customers: ["Zero to Mastery", "NASA"],
    }),
  );
}