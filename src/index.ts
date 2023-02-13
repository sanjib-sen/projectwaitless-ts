import { UseScraper } from "./lib/scrape";

async function main() {
  const scraper = new UseScraper("https://en.wikipedia.org/wiki/Prague");
  console.log(await scraper.getTextById("firstHeading"));
}

main();
