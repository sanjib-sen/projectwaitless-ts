import node_geocoder from "node-geocoder";

let nodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
};

const geocoder = nodeGeocoder(options);

export async function getLocationData(
  address: string
): Promise<node_geocoder.Entry> {
  const locationData = await geocoder.geocode(address);
  return locationData[0];
}
