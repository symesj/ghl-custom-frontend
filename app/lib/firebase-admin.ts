import { initializeApp, applicationDefault, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  credential: applicationDefault(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const adminApp = getApps().length ? getApp() : initializeApp(firebaseAdminConfig);
const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
