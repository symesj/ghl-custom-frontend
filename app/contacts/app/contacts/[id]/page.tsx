"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import Sidebar from "@/app/components/Sidebar";

export default function ContactDetailsPage() {
  const { id } = useParams();
  const [contact, setContact] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
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
      setForm(data.contact);
    };

    onAuthStateChanged(auth, fetchData);
  }, [id]);

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const apiKey = userDoc.data()?.ghlApiKey;

    await fetch(`https://rest.gohighlevel.com/v1/contacts/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("✅ Contact updated.");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">👤 Contact Details</h1>
        {contact ? (
          <div className="space-y-4 max-w-xl">
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Name"
            />
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Email"
            />
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Phone"
            />
            <button
              onClick={handleUpdate}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <p>Loading contact...</p>
        )}
      </main>
    </div>
  );
}
