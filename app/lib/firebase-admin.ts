import { initializeApp, applicationDefault, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const adminApp = getApps().length ? getApp() : initializeApp({
  credential: applicationDefault(),
});

export const adminDb = getFirestore(adminApp);
