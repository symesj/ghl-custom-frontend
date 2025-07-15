'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

import { db } from '@/lib/firebase'; // ✅ Only client-safe export
import ContactModal from '@/components/ContactModal';
import dynamic from 'next/dynamic';

const auth = getAuth();
const ContactDetails = dynamic(() => import('@/components/ContactDetails'), { ssr: false });

export default function ContactListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [subAccountId, setSubAccountId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const userDoc = await getDocs(
          query(collection(db, 'users'), where('uid', '==', user.uid))
        );

        if (userDoc.empty) {
          console.warn('No Firestore user document found for:', user.uid);
          return;
        }

        const userData = userDoc.docs[0].data();
        const subId = userData?.subAccountId;

        if (!subId) {
          console.warn('No subAccountId found in user doc');
          return;
        }

        setSubAccountId(subId);

        // ✅ Fetch GHL API key from our API route
        const res = await fetch(`/api/ghlApiKey?subaccountId=${subId}`);
        const { apiKey } = await res.json();

        if (!apiKey) {
          console.warn(`⚠️ No GHL API key found for subaccount ${subId}`);
        } else {
          console.log("✅ GHL API Key:", apiKey);
          setApiKey(apiKey);
        }

        fetchContactsFromFirestore(subId);
      } catch (err) {
        console.error('❌ Error in auth useEffect:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchContactsFromFirestore = async (subId: string) => {
    setLoading(true);
    try {
      const contactsRef = collection(db, 'ghl_contacts');
      const q = query(contactsRef, where('subAccountId', '==', subId));
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`🔎 Found ${results.length} contacts for subAccountId ${subId}`);
      setContacts(results);
    } catch (err) {
      console.error('❌ Error fetching contacts from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📇 Contacts</h1>
        <button
          onClick={() => subAccountId && fetchContactsFromFirestore(subAccountId)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading contacts...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
            >
              <p className="text-lg font-semibold">
                {contact.firstName} {contact.lastName}
              </p>
              <p className="text-sm text-gray-400">{contact.email}</p>
              <p className="text-sm text-gray-400">{contact.phone}</p>
            </div>
          ))}
        </div>
      )}

      <ContactModal
        isOpen={!!selectedContactId}
        onCloseAction={() => setSelectedContactId(null)}
        contactId={selectedContactId ?? ''}
        ContactDetailComponent={
          selectedContactId && apiKey ? (
            <ContactDetails contactId={selectedContactId} apiKey={apiKey} />
          ) : null
        }
      />
    </div>
  );
}