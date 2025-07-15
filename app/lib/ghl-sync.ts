import { getAllContacts } from "./ghl";import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // your Firestore instance

export async function syncContactsToFirestore() {
const contacts = await getAllContacts();
  for (const contact of contacts) {
    await setDoc(doc(db, "contacts", contact.id), contact, { merge: true });
  }
}