// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

let subscriptions: any[] = [];
const jsonDirectory = path.join(process.cwd(), "json");
const SUBS_FILENAME = "/subscriptions.json";

try {
  subscriptions = JSON.parse(
    fs.readFileSync(jsonDirectory + SUBS_FILENAME, "utf8").toString()
  );
} catch (error) {
  console.error(error);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(subscriptions);
}
