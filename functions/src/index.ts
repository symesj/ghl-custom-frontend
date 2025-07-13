import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const userRef = db.collection("users").doc(user.uid);

  const defaultData = {
    email: user.email || "",
    role: "user",
    subaccountId: "", // You can pre-fill based on logic if needed
    ghlApiKey: "",     // Optional, can be updated later
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await userRef.set(defaultData);
});