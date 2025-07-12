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
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const apiKey = userDoc.data()?.ghlApiKey;

      const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setContact(data.contact);
    });

    return () => unsub();
  }, [id]);

  if (!contact) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{contact.name || "Unnamed Contact"}</h1>
        <div className="space-y-2">
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>Company:</strong> {contact.companyName}</p>
          <p><strong>Source:</strong> {contact.source}</p>
          <p><strong>Contact Status:</strong> {contact.contactStatus}</p>
          <p><strong>Type:</strong> {contact.type}</p>
          <p><strong>Location ID:</strong> {contact.locationId}</p>
          {/* Add more fields as needed */}
        </div>
      </main>
    </div>
  );
}
