"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";

type Contact = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export default function UsersPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const auth = getAuth(app);
      const db = getFirestore(app);

      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const apiKey = userDoc.data()?.ghlApiKey;

        if (!apiKey) {
          console.error("No API key found.");
          return;
        }

        try {
          const res = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();
          setContacts(data.contacts || []);
        } catch (err) {
          console.error("Failed to fetch contacts:", err);
        } finally {
          setLoading(false);
        }
      });
    };

    fetchContacts();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">👥 Contacts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-semibold">
                {c.firstName} {c.lastName}
              </h2>
              <p className="text-gray-400">{c.email}</p>
              <p className="text-gray-400">{c.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
