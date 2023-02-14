import cheerio from "cheerio";
var cloudscraper = require("cloudscraper");
async function useRequests(url: string): Promise<cheerio.Root> {
  console.log("Getting data from", url);
  let response: Promise<string>;
  try {
    response = cloudscraper.get(url);
    return cheerio.load(await response);
  } catch (error) {
    throw new Error(error);
  }
}

export class UseScraper {
  soup: string | cheerio.Root;
  constructor(param: string | cheerio.Root) {
    this.soup = param;
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
