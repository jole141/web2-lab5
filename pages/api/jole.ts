import { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import path from "path";

let subscriptions: PushSubscription[] = [];
const jsonDirectory = path.join(process.cwd(), "json");
const SUBS_FILENAME = "/subscriptions.json";

try {
  subscriptions = JSON.parse(
    fs.readFileSync(jsonDirectory + SUBS_FILENAME, "utf8").toString()
  );
} catch (error) {
  console.error(error);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  res.status(200).json(subscriptions);
}
