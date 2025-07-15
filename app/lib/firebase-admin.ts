// ✅ Server-only Firebase Admin SDK
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY as string);

const adminApp = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };