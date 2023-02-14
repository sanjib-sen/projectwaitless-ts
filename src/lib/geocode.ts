import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
let nodeGeocoder = require("node-geocoder");

async function useNodeGeoCoder(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  const options = {
    provider: "openstreetmap",
  };
  const geocoder = nodeGeocoder(options);
  const locationData = await geocoder.geocode(address);
  if (locationData && locationData.latitude && locationData.longitude) {
    return {
      latitude: locationData[0].latitude,
      longitude: locationData[0].longitude,
    };
  }
  return null;
}

export async function getLocationData(
  address: string
): Promise<{ latitude: number; longitude: number }> {
  return await useGMapNPuppeteer(address);
  // return await useNodeGeoCoder(address);
  // return await useNodeGeoCoder(address);
}

async function useGMapNPuppeteer(
  address: string,
  idleTime: number = 5000
): Promise<{ latitude: number; longitude: number } | null> {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: true, executablePath: executablePath() });
  const page = await browser.newPage();
  await page.goto("http://maps.google.com/maps?q=" + address, {
    waitUntil: "networkidle2",
  });
  await page.waitForNetworkIdle({ idleTime: idleTime });
  const currentUrl = page.url();
  await browser.close();
  if (currentUrl.includes("@")) {
    const ltidueList = currentUrl.split("@")[1].split("/")[0].split(",");
    const longitude = +ltidueList[1];
    const latitude = +ltidueList[0];
    return {
      latitude: latitude,
      longitude: longitude,
    };
  }

  return null;
}
