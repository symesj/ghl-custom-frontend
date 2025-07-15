'use client';

import { getAllContacts } from './ghl';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, app } from './firebase';

export async function syncContactsToFirestore() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) {
    alert('User not logged in.');
    return;
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const apiKey = userSnap.data()?.ghlApiKey;

  if (!apiKey) {
    alert('Missing GHL API key');
    return;
  }

  const contacts = await getAllContacts(apiKey);

  for (const contact of contacts) {
    await setDoc(doc(db, 'ghl_contacts', contact.id), contact, { merge: true });
  }

  alert('✅ GHL contacts synced to Firestore');
}