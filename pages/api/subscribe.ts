import { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import path from "path";
import { Pool } from "pg";

type Data = {
  message: any;
};

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
  res: NextApiResponse<Data>
): Promise<void> {
  let sub = req.body.sub;
  try {
    await pool.connect();
    await pool.query("INSERT INTO subscriptions (subscription) VALUES ($1)", [
      JSON.stringify(sub),
    ]);
    res.status(200).json({ message: sub });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
