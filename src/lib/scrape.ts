import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const scrapeops_api_key = process.env.scrapeops_api_key;

async function useRequests(
  url: string,
  bypass: string = "cloudflare"
): Promise<cheerio.Root> {
  let response: AxiosResponse;
  try {
    response = await axios.get("https://proxy.scrapeops.io/v1/", {
      params: {
        api_key: scrapeops_api_key,
        url: url,
        bypass: bypass,
      },
    });
    const html = response.data;
    return cheerio.load(html);
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
    // const $ = await this.getSouped();
    // console.log("souped_data:", $(`.Text-sc-1t0gn2o-0 ewsuaX`).text().trim());
    // return $(`${jquery}`).text().trim();

    /**
     * Cheerio Not working, going with puppeteer for now
     */

    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath(),
    });
    const page = await browser.newPage();

    await page.goto("https://ra.co/clubs/22343", { waitUntil: "networkidle0" });
    const text = await (
      await (
        await page.$("[class='Text-sc-1t0gn2o-0 fILZhg']")
      ).getProperty("textContent")
    ).jsonValue();
    console.log(
      "🚀 ~ file: scrape.ts:53 ~ UseScraper ~ getTextByJquery ~ text",
      text
    );
    return text;
  }
}
