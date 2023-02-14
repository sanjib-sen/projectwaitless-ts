import fs from "fs";
import { parse } from "csv-parse";

export async function csvToArray(path: string) {
  const records = [];
  const parser = fs
    .createReadStream(path)
    .pipe(parse({ delimiter: ",", from_line: 2 }));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
}
