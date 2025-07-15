'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';
import ContactModal from '@/components/ContactModal';
import dynamic from 'next/dynamic';

const auth = getAuth(app);
const db = getFirestore(app);

// Lazy load the contact details
const ContactDetails = dynamic(() => import('@/components/ContactDetails'), { ssr: false });

export default function ContactListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchContacts = async (key: string) => {
    setLoading(true);
    try {
      let allContacts: any[] = [];
      let startAfter = '';
      let startAfterId = '';
      let hasMore = true;

      while (hasMore) {
        const url = `/api/contacts${startAfter ? `?startAfter=${startAfter}&startAfterId=${startAfterId}` : ''}`;

        const res = await fetch(url, {
          headers: {
            ghlApiKey: key,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch contacts: ${res.status}`);
        const data = await res.json();

        const batch = data.contacts || [];
        allContacts = [...allContacts, ...batch];

        if (data.meta?.nextPageUrl && batch.length > 0) {
          const last = batch[batch.length - 1];
          startAfter = last.createdAt;
          startAfterId = last.id;
        } else {
          hasMore = false;
        }
      }

      setContacts(allContacts);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const key = userDoc.data()?.ghlApiKey;
      setApiKey(key);
      if (key) fetchContacts(key);
    });
  }, []);

  const refreshContacts = () => {
    if (apiKey) fetchContacts(apiKey);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📇 Contacts</h1>
        <button
          onClick={refreshContacts}
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
              <p className="text-lg font-semibold">{contact.firstName} {contact.lastName}</p>
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