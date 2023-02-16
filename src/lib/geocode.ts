import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath, Puppeteer } from "puppeteer";
let nodeGeocoder = require("node-geocoder");
import axios from "axios";
import * as dotenv from "dotenv";

type GetLocationDataMethod = "puppeteergmap" | "nodegeocoder" | "positionstack";

/**
 * address: <string>
 * method: "puppeteergmap" | "nodegeocoder" | "positionstack (Default)";
 *    puppeteergmap: Medium reliable, free
 *    nodegeocoder: Not reliable, free
 *    positionstack: Most reliable, uses_api, but cheap
 */
export async function getLocationData(
  address: string,
  method: GetLocationDataMethod = "positionstack"
): Promise<{ latitude: number; longitude: number }> {
  if (method === "positionstack") {
    return await usePositionStack(address);
  } else if (method === "nodegeocoder") {
    return await useNodeGeoCoder(address);
  } else if (method === "puppeteergmap") {
    return await useGMapNPuppeteer(address);
  }
}

async function usePositionStack(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  dotenv.config();
  const positionstack_api_key = process.env.positionstack_api_key;
  const response = await axios.get("http://api.positionstack.com/v1/forward", {
    params: {
      access_key: positionstack_api_key,
      query: address,
    },
  });
  const data = await response.data.data;
  if (data) {
    return {
      latitude: data[0].latitude,
      longitude: data[0].longitude,
    };
  }
  return null;
}

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
