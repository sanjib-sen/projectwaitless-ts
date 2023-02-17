import {
  useAxiosWithProxy,
  useCloudScraper,
  usePuppeteer,
  useAxios,
} from "./requests";

type ScrapeMethod = "proxy" | "puppeteer" | "cloudscraper" | "axios";

async function useRequests(
  url: string,
  scrapeMethod: ScrapeMethod = "cloudscraper"
): Promise<cheerio.Root> {
  console.log("Getting data from", url);
  try {
    //
    if (scrapeMethod === "cloudscraper") {
      return useCloudScraper(url);
    } else if (scrapeMethod === "proxy") {
      return useAxiosWithProxy(url);
    } else if (scrapeMethod === "puppeteer") {
      return usePuppeteer(url);
    } else if (scrapeMethod === "axios") {
      return useAxios(url);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export class UseScraper {
  soup: string | cheerio.Root;
  scrapeMethod: ScrapeMethod;

  /**
   * url: url <string>
   * scrapeMethod: "proxy" | "puppeteer" | "cloudscraper (Default) | axios";
   *    proxy: Most reliable, but so slow, uses API
   *    puppeteer: Sometimes can't bypass cloudflare
   *    cloudscraper: Superfast. But sometimes can't bypass cloudflare
   *    axios: Superfast, can't bypass capcha and cloudflare. vanilla axios.
   */
  constructor(url: string, scrapeMethod: ScrapeMethod = "cloudscraper") {
    this.soup = url;
    this.scrapeMethod = scrapeMethod;
  }
  async getSouped(): Promise<cheerio.Root> {
    if (typeof this.soup === "string") {
      this.soup = await useRequests(this.soup);
    }
    return this.soup;
  }

  async getByJquery(
    jquery: string,
    attribute: string | null = null
  ): Promise<string> {
    const $ = await this.getSouped();
    if (attribute) {
      return $(`${jquery}`).attr(attribute);
    }
    return $(`${jquery}`).text().trim();
  }
}
