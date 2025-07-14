"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import Sidebar from "@/app/components/Sidebar";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "user">("user");

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      setRole(userData?.role || "user");

      const apiKey = userData?.ghlApiKey;
      if (apiKey) {
        fetchContacts(apiKey);
      } else {
        console.warn("⚠️ No GHL API key found.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchContacts = async (apiKey: string) => {
    try {
      const res = await fetch("https://rest.gohighlevel.com/v1/contacts", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error("❌ Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} onLogoutAction={() => {}} />

      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">📇 Contacts</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {contacts.map((contact) => (
              <li key={contact.id} className="bg-gray-800 p-4 rounded shadow">
                <Link href={`/contacts/${contact.id}`}>
                  <div className="hover:opacity-80 transition cursor-pointer">
                    <p className="font-semibold">{contact.name || "No Name"}</p>
                    <p className="text-gray-400 text-sm">{contact.email}</p>
                    <p className="text-gray-400 text-sm">{contact.phone}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}