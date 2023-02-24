import { csvToArray } from "../lib/csv";
import { Venue } from "../types/types";

export async function task04() {
  const fastsoma = await csvToArray("resources\\fatsoma_db_rows.csv");
  const ra = await csvToArray("resources\\residentadvisor_root_db_rows.csv");
  const skiddle = await csvToArray("resources\\skiddle_venue_db_rows.csv");
  const listed_venues: string[] = [];
  const venues: Venue[] = [];
  for (let index = 0; index < fastsoma.length; index++) {
    const element = fastsoma[index];
    const venue: Venue = {
      venue_name: element[0],
      venue_address: element[1],
      google_map_url: element[2],
      owner_url: element[3],
      venue_latitude: element[4],
      venue_longitude: element[5],
      venue_type: element[6],
    };
    const venue_identity =
      String(venue.venue_latitude) + "," + String(venue.venue_longitude);
    if (listed_venues.includes(venue_identity) === false) {
      venues.push(venue);
      listed_venues.push(venue_identity);
    }
  }

  for (let index = 0; index < ra.length; index++) {
    const element = ra[index];
    const venue: Venue = {
      venue_name: element[1],
      venue_address: element[2],
      google_map_url: element[7],
      owner_url: element[3],
      venue_latitude: element[4],
      venue_longitude: element[13],
      venue_type: element[14],
    };

    const venue_identity =
      String(venue.venue_latitude) + "," + String(venue.venue_longitude);
    if (listed_venues.includes(venue_identity) === false) {
      venues.push(venue);
      listed_venues.push(venue_identity);
    }
  }

  for (let index = 0; index < skiddle.length; index++) {
    const element = skiddle[index];
    const venue: Venue = {
      venue_name: element[2],
      venue_address: element[10],
      google_map_url: "Not mentioned",
      owner_url: element[6],
      venue_latitude: element[17],
      venue_longitude: element[18],
      venue_type: element[13],
    };
    const venue_identity =
      String(venue.venue_latitude) + "," + String(venue.venue_longitude);
    if (listed_venues.includes(venue_identity) === false) {
      venues.push(venue);
      listed_venues.push(venue_identity);
    }
  }
  console.log(venues);
}
