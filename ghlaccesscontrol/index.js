const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// ✅ Set custom claims like subAccountId for secure Firestore access
exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  // Optional: ensure only admins can call this
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can assign claims.");
  }

  const { uid, subAccountId } = data;

  if (!uid || !subAccountId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing uid or subAccountId.");
  }

  await admin.auth().setCustomUserClaims(uid, {
    subAccountId,
    role: "user"
  });

  return { message: `✅ Claims set for UID: ${uid}` };
});