import { UseScraper } from "./lib/scrape";

async function main() {
  const scraper = new UseScraper("https://en.wikipedia.org/wiki/Prague");
  console.log(
    await scraper.getTextByJquery(".vector-user-menu-anon-editor > p")
  );
  console.log(await scraper.getTextByJquery("#firstHeading"));
}

main();
