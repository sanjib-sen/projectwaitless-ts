import cheerio from "cheerio";
var cloudscraper = require("cloudscraper");

async function useRequests(url: string): Promise<cheerio.Root> {
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

  async getTextByJquery(jquery: string): Promise<string> {
    const $ = await this.getSouped();
    return $(`${jquery}`).text().trim();
  }
}
