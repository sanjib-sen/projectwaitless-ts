import { Club, getClubData } from "./lib/club";
import { csvToArray } from "./lib/csv";

async function main() {
  const clubsArray = await csvToArray(
    "resources/residentadvisor_root_db_rows.csv"
  );
  for (let index = 0; index < clubsArray.length; index++) {
    const club = clubsArray[index];
    const clubData: Club = {
      id: club[0],
      venue_name: club[1],
      owner_url: club[3],
      location: club[2],
    };
    const clubJson = await getClubData(clubData);
    console.log("🚀 ~ file: index.ts:18 ~ main ~ clubJson", clubJson);
  }
}

main();
