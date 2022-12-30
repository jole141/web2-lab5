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
      "BMLeXMRXNrG4ESa31NbsWrGaRznHYyND8vAgVr-XfdNixLHqA_CT_ozVF6WtuPcaYewDdDJcjPJpgIqXF29stIc",
    privateKey: "UtG2XgsHUgdwC4zAAEYygmkzUF__EWb123pOorzG9oI",
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
