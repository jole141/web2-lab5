import type { NextApiRequest, NextApiResponse } from "next";
import webPush from "web-push";
import fs from "fs";
import path from "path";

let subscriptions: any[] = [];
const jsonDirectory = path.join(process.cwd(), "json");
const SUBS_FILENAME = "/subscriptions.json";

try {
  subscriptions = JSON.parse(
    fs.readFileSync(jsonDirectory + SUBS_FILENAME).toString()
  );
} catch (error) {
  console.error(error);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the VAPID keys
  const vapidKeys = {
    publicKey:
      "BHWtFE4ZonR0NiQFh_B_bpbgGNmcCaqvA49uvx_63H3UI28KrpLHkqwHfOcsYOuFMcKlIjoTF0dyKHrg80pYyHk",
    privateKey: "FudqkbYofWdcjDxn9r4_2SEZc8OAg2z0-mccdoeR7Gw",
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
