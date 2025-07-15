// /api/sync-contacts.cron.ts
import { NextApiRequest, NextApiResponse } from "next";
import { syncContactsToFirestore } from "@/lib/ghl-sync";

export const config = {
  schedule: "*/30 * * * *" // every 30 minutes
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await syncContactsToFirestore();
  res.status(200).json({ message: "GHL contacts synced successfully" });
}