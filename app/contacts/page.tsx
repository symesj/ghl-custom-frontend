"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import Sidebar from "@/app/components/Sidebar";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const apiKey = userDoc.data()?.ghlApiKey;
        if (apiKey) fetchAllContacts(apiKey);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllContacts = async (apiKey: string) => {
    const allContacts: any[] = [];
    let nextPageUrl: string | null = "https://rest.gohighlevel.com/v1/contacts/";

    try {
      while (nextPageUrl) {
        const res: Response = await fetch(nextPageUrl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        allContacts.push(...(data.contacts || []));

        nextPageUrl = data.meta?.nextPageUrl || null;
      }

      setContacts(allContacts);
    } catch (err) {
      console.error("❌ Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">📇 Contacts</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="bg-gray-800 p-4 rounded shadow flex justify-between"
              >
                <div>
                  <p className="font-semibold">{contact.name || "No Name"}</p>
                  <p className="text-gray-400 text-sm">{contact.email}</p>
                  <p className="text-gray-400 text-sm">{contact.phone}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}