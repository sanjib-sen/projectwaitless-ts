import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
async function useRequests(url: string) {
  let response: AxiosResponse;
  try {
    response = await axios.get(url, { params: {} });
  } catch (error) {
    console.error(error);
  }
  const html = response.data;
  return cheerio.load(html);
}

export class UseScraper {
  element: string | cheerio.Root;
  constructor(param: string | cheerio.Root) {
    this.element = param;
  }
  async getSouped() {
    if (typeof this.element === "string") {
      return await useRequests(this.element);
    } else if (this.element instanceof cheerio.root) {
      return this.element;
    }
  }

  async getTextById(id: string): Promise<string> {
    const $ = await this.getSouped();
    return $(`\#${id}`).text();
  }
}
