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
  return cheerio.load(html);
}

export class UseScraper {
  element: string | cheerio.Selector
  constructor(param: string | cheerio.Selector) {
    this.element = param;
  }
  async getSouped():Promise<cheerio.Selector> {
    if (typeof this.element === "string") {
      return await useRequests(this.element);
    } else if (this.element instanceof cheerio) {
      return this.element;
    }
  }

  async getTextById(id: string): Promise<string> {
    const $ = await this.getSouped();
    return $(`\#${id}`).text();
  }

  async getTextByTagNClass(tag:string, className: string, index:number=0): Promise<string> {
    const $ = await this.getSouped();
    return $(`${tag}.${className}`).text();
  }
}
