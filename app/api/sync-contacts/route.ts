// app/api/sync-contacts/route.ts

import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function GET() {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const allUsers = usersSnapshot.docs.map(doc => doc.data());

    // example operation: store user count under meta/lastSync
    const metaRef = doc(db, 'meta', 'lastSync');
    await setDoc(metaRef, { timestamp: new Date().toISOString(), totalUsers: allUsers.length });

    return NextResponse.json({ message: 'Synced successfully!', count: allUsers.length });
  } catch (err) {
    console.error('🔥 Sync error:', err);
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}