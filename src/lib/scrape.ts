import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
async function useRequests(url: string): Promise<cheerio.Selector> {
  let response: AxiosResponse;
  try {
    response = await axios.get(url, { params: {} });
  } catch (error) {
    console.error(error);
  }
  const html = response.data;
  console.log("Scrapped", url);
  return cheerio.load(html);
}

export class UseScraper {
  soup: string | Promise<cheerio.Selector>;
  constructor(param: string | Promise<cheerio.Selector>) {
    this.soup = param;
  }
  async getSouped(): Promise<cheerio.Selector> {
    if (typeof this.soup === "string") {
      this.soup = useRequests(this.soup);
    }
    return this.soup;
  }

  async getTextByJquery(jquery: string): Promise<string> {
    const $ = await this.getSouped();
    return $(`${jquery}`).text().trim();
  }
}
