import { getAllContacts } from './ghl';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function syncContactsToFirestoreServer(apiKey: string, subAccountId: string) {
  if (!apiKey || !subAccountId) {
    throw new Error('Missing apiKey or subAccountId');
  }

  const contacts = await getAllContacts(apiKey);

  for (const contact of contacts) {
    await setDoc(
      doc(db, 'contacts', contact.id),
      {
        ...contact,
        subAccountId,
      },
      { merge: true }
    );
  }

  return `✅ Synced ${contacts.length} contacts`;
}