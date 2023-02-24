import { getLocationData } from "../lib/geocode";
import { UseScraper } from "../lib/scrape";
import { sleep } from "../lib/utils";
import { Venue } from "../types/types";

const Venues: Venue[] = [];
const venue_names: string[] = [];
let event_hrefs: string[] = [];

export async function task03() {
  let pageNo = 1;
  while (pageNo < 201) {
    const scraper_root = new UseScraper(
      `https://www.fatsoma.com/discover?page=${pageNo}`,
      "cloudscraper"
    );
    const $ = await scraper_root.getSouped();
    $("div._content_xz4oby").each((_, elem) => {
      const venue_name = $(elem)
        .find("div._meta_xz4oby>div>span")
        .text()
        .trim();
      const event_href =
        "https://www.fatsoma.com" +
        $(elem).find("a.ember-view._link_xz4oby").attr("href");
      if (venue_names.includes(venue_name) === false) {
        event_hrefs.push(event_href);
        venue_names.push(venue_name);
      }
    });
    console.log(venue_names);
    for (let index = 0; index < event_hrefs.length; index++) {
      const eventHref = event_hrefs[index];
      const eventScraper = new UseScraper(eventHref, "puppeteer");
      const venue_name = await eventScraper.getByJquery("div._name_cbelrm");
      const $ = await eventScraper.getSouped();
      let venue_type: string;
      $("a.ember-view._tag_6uhsxy").each((_, elem) => {
        const texContent = $(elem).text().trim();
        if (texContent.includes("in")) {
          venue_type = texContent.split("s in")[0]; // e.g. "/Club/s in London"
        }
      });
      const venue_address = await eventScraper.getByJquery(
        "div._address_cbelrm"
      );
      const google_map_url = await eventScraper.getByJquery(
        "a._link_cbelrm",
        "href"
      );
      const venue_location = await google_map_url.split("daddr=")[1]; // e.g. daddr=51.2666129,0.5399824'
      const venue: Venue = {
        venue_name: venue_name,
        venue_address: venue_address,
        google_map_url: google_map_url,
        owner_url: eventHref,
        venue_latitude: +venue_location.split(",")[0],
        venue_longitude: +venue_location.split(",")[1],
        venue_type: venue_type,
      };
      console.log(venue);
      Venues.push(venue);
      await sleep(3000);
    }
    event_hrefs = [];
    pageNo += 1;
    await sleep(5000);
  }
}
