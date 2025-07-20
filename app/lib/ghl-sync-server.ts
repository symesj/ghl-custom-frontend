import { getAllContacts } from './ghl';
import { adminDb } from './firebase';

export async function syncContactsToFirestoreServer(apiKey: string, subAccountId: string) {
  if (!apiKey || !subAccountId) {
    throw new Error('Missing apiKey or subAccountId');
  }

  const contacts = await getAllContacts(apiKey);

  for (const contact of contacts) {
    await adminDb.collection('contacts')
      .doc(contact.id)
      .set(
        {
          ...contact,
          subAccountId,
        },
        { merge: true }
      );
  }

  return `✅ Synced ${contacts.length} contacts`;
}