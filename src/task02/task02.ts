import { csvToArray } from "../lib/csv";
import { UseScraper } from "../lib/scrape";

type ClubShort = {
  id: number;
  venue_opening_status: boolean;
  owner_url: string;
  venue_activity: boolean;
};

export async function task02() {
  const noSource: ClubShort[] = [];
  const notCorrect: { old: ClubShort; new: ClubShort }[] = [];
  const clubsArray = await csvToArray("resources/skiddle_venue_db_rows.csv");
  for (let index = 0; index < clubsArray.length; index++) {
    const club = clubsArray[index];
    const clubData: ClubShort = {
      id: +club[0],
      venue_opening_status: club[4] === "true",
      owner_url: club[6],
      venue_activity: club[19] === "true",
    };
    if (clubData.owner_url) {
      const scraper = new UseScraper(clubData.owner_url);
      const opening_status_text = await scraper.getByJquery(
        "div.tc-white.pad-10.bg-warningred"
      );
      const opening_status = opening_status_text.includes(
        "This venue has been reported as closed!"
      );
      const activity_status_text = await scraper.getByJquery(
        "p.bg-warningred.tc-white.pad-10"
      );
      const activity_status = activity_status_text.includes(
        "No future events currently found at"
      );
      console.log(clubData.id, opening_status, activity_status);

      if (
        !(opening_status === clubData.venue_opening_status) ||
        !(activity_status === clubData.venue_activity)
      ) {
        const foundData: ClubShort = clubData;
        foundData.venue_opening_status = opening_status;
        foundData.venue_activity = activity_status;

        const differentClub = {
          old: clubData,
          new: foundData,
        };
        notCorrect.push(differentClub);
      }
    } else {
      noSource.push(clubData);
    }
    console.log("🚀 ~ file: index.ts:18 ~ main ~ clubJson", notCorrect);
  }
}
