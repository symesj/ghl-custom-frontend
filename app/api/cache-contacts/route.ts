// app/api/cache-contacts/route.ts
import { NextResponse } from "next/server";
import { cacheGHLContacts } from "@/lib/cacheContacts";

export async function GET() {
  try {
    await cacheGHLContacts();
    return NextResponse.json({ message: "Contacts cached successfully ✅" });
  } catch (error) {
    console.error("❌ Cache error:", error);
    return NextResponse.json({ error: "Failed to cache contacts" }, { status: 500 });
  }
}