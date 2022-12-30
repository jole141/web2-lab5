import type { NextApiRequest, NextApiResponse } from "next";
import webPush from "web-push";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "web2_fer_labosi",
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  // get all subscriptions from database
  await pool.connect();
  const result = await pool.query("SELECT * FROM subscriptions");
  const subscriptions = result.rows;

  try {
    for (const sub of subscriptions) {
      await webPush.sendNotification(
        JSON.parse(sub.subscription),
        JSON.stringify({
          title: "Obavijest",
          body: "Poslana je obavijest",
        })
      );
    }
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(500).json({ status: error });
  }
}
