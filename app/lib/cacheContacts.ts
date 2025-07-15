import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { app } from "@/firebase";
import { getAllContacts } from "@/lib/ghl";

export async function cacheGHLContacts() {
  const db = getFirestore(app);
  const contacts = await getAllContacts();

  const batchSize = 500; // Firestore has a write limit; batching is safer
  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];

    if (!c.id) continue;

    const contactRef = doc(db, "ghl_contacts", c.id); // Use GHL ID as the Firestore doc ID

    await setDoc(contactRef, {
      firstName: c.firstName || "",
      lastName: c.lastName || "",
      email: c.email || "",
      ghlId: c.id,
    });
  }

  console.log("✅ GHL contacts cached in Firestore");
}