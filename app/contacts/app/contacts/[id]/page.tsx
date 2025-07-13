"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import Sidebar from "@/app/components/Sidebar";

export default function ContactDetailPage() {
  const { id } = useParams();
  const [contact, setContact] = useState<any>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const apiKey = userDoc.data()?.ghlApiKey;
        if (!apiKey) return;

        const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        setContact(data.contact || {});
      }
    });

    return () => unsub();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="p-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">Contact Detail</h1>
        {contact ? (
          <div className="space-y-2">
            <div><strong>Name:</strong> {contact.name}</div>
            <div><strong>Email:</strong> {contact.email}</div>
            <div><strong>Phone:</strong> {contact.phone}</div>
            <div><strong>Company:</strong> {contact.companyName}</div>
            <div><strong>Address:</strong> {contact.address1}</div>
            {/* Add more editable fields here */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}
