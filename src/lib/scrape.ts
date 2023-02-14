import cheerio from "cheerio";
var cloudscraper = require("cloudscraper");
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
import axios from "axios";
import * as dotenv from "dotenv";

async function useRequests(url: string): Promise<cheerio.Root> {
  console.log("Getting data from", url);
  try {
    return useAxiosWithProxy(url);
  } catch (error) {
    throw new Error(error);
  }
}

async function useCloudScraper(url: string) {
  const response = cloudscraper.get(url);
  return cheerio.load(await response);
}

async function useAxiosWithProxy(
  url: string,
  proxy: string = "https://proxy.scrapeops.io/v1/",
  bypass: string = "cloudflare"
) {
  dotenv.config();
  const scrapeops_api_key = process.env.scrapeops_api_key;
  const response = await axios.get(proxy, {
    params: {
      api_key: scrapeops_api_key,
      url: url,
      bypass: bypass,
    },
  });
  const html = response.data;
  return cheerio.load(html);
}

async function usePuppeteer(url: string, headless: boolean = true) {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: headless, executablePath: executablePath() });
  const page = await browser.newPage();
  await page.goto(url);
  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });
  await browser.close();
  return cheerio.load(pageData.html);
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
