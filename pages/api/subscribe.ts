import { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import path from "path";

type Data = {
  subscriptions: PushSubscription[];
};

let subscriptions: PushSubscription[] = [];
const jsonDirectory = path.join(process.cwd(), "json");
const SUBS_FILENAME = "/subscriptions.json";

try {
  subscriptions = JSON.parse(
    fs.readFileSync(jsonDirectory + SUBS_FILENAME).toString()
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
  fs.writeFileSync(
    jsonDirectory + SUBS_FILENAME,
    JSON.stringify(subscriptions)
  );
  res.status(200).json({ subscriptions: subscriptions });
}
