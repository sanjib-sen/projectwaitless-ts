import { getClubData } from "./lib/club";

async function main() {
  const club = await getClubData(
    "123",
    "bd",
    "https://ra.co/clubs/4811",
    "dhaka"
  );
  console.log(club);
}

main();
