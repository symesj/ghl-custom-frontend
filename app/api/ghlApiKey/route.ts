// app/api/ghlApiKey/route.ts

import { NextResponse } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY as string);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subaccountId = searchParams.get('subaccountId');

    if (!subaccountId) {
      return NextResponse.json({ error: 'Missing subaccountId' }, { status: 400 });
    }

    const db = getFirestore();
    const docRef = doc(db, 'subaccounts', subaccountId, 'branding', 'config');
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      console.warn(`⚠️ No config doc for subaccount: ${subaccountId}`);
      return NextResponse.json({ error: 'No config found' }, { status: 404 });
    }

    const data = snap.data();
    return NextResponse.json({ apiKey: data?.ghlApiKey || null });
  } catch (err) {
    console.error('❌ Error in /api/ghlApiKey:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}