import { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import path from "path";

type Data = {
  success: boolean;
};

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
  res: NextApiResponse<Data>
): void {
  let sub = req.body.sub;
  subscriptions.push(sub);
  console.log(sub);
  fs.writeFileSync(
    jsonDirectory + SUBS_FILENAME,
    JSON.stringify(subscriptions),
    "utf8"
  );
  res.status(200).json({ success: true });
}
