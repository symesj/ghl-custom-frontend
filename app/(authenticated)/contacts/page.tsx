'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';
import ContactModal from '@/components/ContactModal';
import dynamic from 'next/dynamic';

// Lazy load the contact details component
const ContactDetails = dynamic(() => import('@/components/ContactDetails'), { ssr: false });

const auth = getAuth(app);
const db = getFirestore(app);

export default function ContactListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const key = userDoc.data()?.ghlApiKey;
      setApiKey(key);
      if (key) fetchContacts(key);
    });
  }, []);

  const fetchContacts = async (key: string) => {
    setLoading(true);
    try {
      let allContacts: any[] = [];
      let nextPageUrl = 'https://rest.gohighlevel.com/v1/contacts?limit=100';

      while (nextPageUrl) {
        const res = await fetch(nextPageUrl, {
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();

        allContacts = [...allContacts, ...(data.contacts || [])];
        const rawUrl = data.meta?.nextPageUrl || '';
        nextPageUrl = rawUrl ? rawUrl.replace('http://', 'https://') : '';
      }

      setContacts(allContacts);
      setToast(`✅ ${allContacts.length} contacts loaded successfully`);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
      setToast('❌ Failed to load contacts');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.firstName?.toLowerCase().includes(term) ||
      c.lastName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold mb-6">📇 Contacts</h1>

      {/* Search & Refresh */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search contacts…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-gray-800 text-white px-3 py-2 rounded"
        />
        <button
          onClick={() => apiKey && fetchContacts(apiKey)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
          <div className="border-4 border-blue-500 border-t-transparent animate-spin rounded-full w-12 h-12" />
        </div>
      )}

      {/* Toast Message */}
      {toast && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      {/* Contacts Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
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

      {/* Contact Detail Modal */}
      <ContactModal
        isOpen={!!selectedContactId}
        onCloseAction={() => setSelectedContactId(null)}
        contactId={selectedContactId ?? ''}
        ContactDetailComponent={
          selectedContactId && apiKey ? <ContactDetails contactId={selectedContactId} apiKey={apiKey} /> : <></>
        }
      />
    </div>
  );
}