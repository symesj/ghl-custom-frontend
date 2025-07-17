import { initializeApp, applicationDefault, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Optional: use `cert()` with service account if needed
const firebaseAdminConfig = {
  credential: applicationDefault(), // Or use cert({ clientEmail, privateKey, projectId }) if needed
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const adminApp = getApps().length ? getApp() : initializeApp(firebaseAdminConfig);

const db = getFirestore(adminApp);

export { db };
