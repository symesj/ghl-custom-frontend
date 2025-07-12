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
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const apiKey = userDoc.data()?.ghlApiKey;

      if (apiKey) {
        const allContacts = await fetchAllContacts(apiKey);
        setContacts(allContacts);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllContacts = async (apiKey: string) => {
    let all: any[] = [];
    let nextPageToken = "";

    do {
      const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/?limit=100${nextPageToken ? `&nextPageToken=${nextPageToken}` : ""}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      all.push(...data.contacts);
      nextPageToken = data.nextPageToken || "";
    } while (nextPageToken);

    return all;
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">📇 Contacts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`}>
              <div className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 cursor-pointer">
                <h2 className="text-lg font-semibold">{contact.name || "No Name"}</h2>
                <p className="text-gray-400">{contact.email}</p>
                <p className="text-gray-400">{contact.phone}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
