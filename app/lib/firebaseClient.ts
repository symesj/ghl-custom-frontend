import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const docRef = adminDb.doc(`users/${userId}`);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = snap.data();
    return NextResponse.json({ apiKey: data?.ghlApiKey ?? null });
  } catch (err) {
    console.error('🔥 Error fetching GHL API key:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}