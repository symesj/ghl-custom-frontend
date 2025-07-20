import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase'; // ✅ Uses server-only Firestore

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subAccountId = searchParams.get('subaccountId');

  if (!subAccountId) {
    return NextResponse.json({ error: 'Missing subaccountId' }, { status: 400 });
  }

  try {
    const docRef = adminDb.doc(`subaccounts/${subAccountId}/branding/config`);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'No config found' }, { status: 404 });
    }

    const data = snap.data();
    return NextResponse.json({ apiKey: data?.ghlApiKey ?? null });
  } catch (err) {
    console.error('🔥 Error fetching GHL API key:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}