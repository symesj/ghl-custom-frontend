'use client';

import { getAllContacts } from './ghl';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, app } from '../firebase';

export async function syncContactsToFirestore() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) {
    alert('User not logged in.');
    return;
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const apiKey = userData?.ghlApiKey;
  const subAccountId = userData?.subAccountId;

  if (!apiKey || !subAccountId) {
    alert('Missing GHL API key or subAccountId');
    return;
  }

  const contacts = await getAllContacts(apiKey);

  for (const contact of contacts) {
    await setDoc(
      doc(db, 'contacts', contact.id), // changed from 'ghl_contacts' to 'contacts' to match your Firestore structure
      {
        ...contact,
        subAccountId, // tag each contact with the owner subaccount
      },
      { merge: true }
    );
  }

  alert('✅ GHL contacts synced to Firestore');
}