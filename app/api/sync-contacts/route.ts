import { NextRequest, NextResponse } from "next/server";
import { syncContactsToFirestore } from "@/lib/ghl";

export const dynamic = "force-dynamic"; // required for cron to trigger on Vercel

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("token");
  const expected = process.env.CRON_SECRET;

  if (secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await syncContactsToFirestore();
    return NextResponse.json({ message: "Synced contacts successfully" });
  } catch (err) {
    console.error("Error during contact sync:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}