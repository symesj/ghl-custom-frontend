"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);
        const apiKey = userDoc.data()?.ghlApiKey;

        if (apiKey) {
          const res = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          setContacts(data.contacts);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">📇 Contacts</h1>
        <ul className="space-y-4">
          {contacts.map((c) => (
            <li key={c.id} className="bg-gray-800 p-4 rounded shadow">
              <Link href={`/contacts/${c.id}`}>
                <div className="cursor-pointer">
                  <div className="text-lg font-semibold">{c.name || "Unnamed"}</div>
                  <div className="text-sm text-gray-400">{c.email || "No email"}</div>
                  <div className="text-sm text-gray-400">{c.phone || "No phone"}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
