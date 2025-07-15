// app/api/sync-contacts.cron.ts

import { syncContactsToFirestore } from "@/lib/ghl-sync";

// This is a Vercel Scheduled Function – no need for req/res
export default async function handler() {
  await syncContactsToFirestore();
}