import type { NextApiRequest, NextApiResponse } from "next";
import webPush from "web-push";
import fs from "fs";
import path from "path";

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
  // Set the VAPID keys
  const vapidKeys = {
    publicKey:
      "BAqL-JB2EUQrhwsYYVZ-tM57FpQNy4LehG8DdemURuiW9zGcNz91CMCutmGhl2xZrly29DszWJ2x7hFBeAhhuAc",
    privateKey: process.env.VAPID_PRIVATE_KEY || "",
  };

  webPush.setVapidDetails(
    "mailto:jj52362@fer.hr",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  subscriptions.forEach(async (sub) => {
    try {
      await webPush.sendNotification(
        sub,
        JSON.stringify({
          title: "Obavijest",
          body: "Poslana je obavijest",
        })
      );
      res.status(200).json({ status: true });
    } catch (error) {
      res.status(500).json({ status: error });
    }
  });
}
