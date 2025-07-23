import { getAllContacts } from './ghl';
import { db } from './firebase';

export async function syncContactsToFirestoreServer(apiKey: string, subAccountId: string) {
  if (!apiKey || !subAccountId) {
    throw new Error('Missing apiKey or subAccountId');
  }

  const contacts = await getAllContacts(apiKey);

  for (const contact of contacts) {
    const docRef = db.collection('contacts').doc(contact.id);
    await docRef.set({
      ...contact,
      subAccountId,
    }, { merge: true });
  }

  return `✅ Synced ${contacts.length} contacts`;
}