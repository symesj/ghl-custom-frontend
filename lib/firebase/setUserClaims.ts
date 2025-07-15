import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export async function setUserClaims(subAccountId: string) {
  try {
    const app = getApp();
    const functions = getFunctions(app);
    const auth = getAuth(app);

    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found");

    const setClaims = httpsCallable(functions, "setCustomClaims");

    const result = await setClaims({
      uid: user.uid,
      subAccountId,
    });

    console.log("✅ setCustomClaims result:", result.data);
    return result.data;
  } catch (err) {
    console.error("❌ Error setting custom claims:", err);
    throw err;
  }
}