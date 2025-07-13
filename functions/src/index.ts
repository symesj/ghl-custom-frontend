import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();

  const defaultSubaccountId = "fastline-main"; // ✅ Change if you want to assign differently later

  const userRef = db.collection("users").doc(user.uid);

  await userRef.set({
    name: user.displayName || "Unnamed User",
    email: user.email,
    role: "user",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    subaccountId: defaultSubaccountId, // 🔥 Assigned here
  });

  console.log(`✅ User ${user.email} created in Firestore with subaccount ${defaultSubaccountId}`);
});