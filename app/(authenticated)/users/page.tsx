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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(6); // Number per page
  const [loading, setLoading] = useState(true);

  // 🔍 Filtered contacts
  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      contact.email?.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone?.includes(search)
    );
  });

  // Pagination
  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);

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

      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-2 rounded text-black w-full max-w-md"
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredContacts.length === 0 ? (
        <p>No contacts match your search.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentContacts.map((c) => (
              <div key={c.id} className="bg-gray-800 p-4 rounded shadow">
                <h2 className="text-lg font-semibold">
                  {c.firstName} {c.lastName}
                </h2>
                <p className="text-gray-400">{c.email}</p>
                <p className="text-gray-400">{c.phone}</p>
              </div>
            ))}
          </div>

          {/* ⏮️ Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  indexOfLast < filteredContacts.length ? p + 1 : p
                )
              }
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              disabled={indexOfLast >= filteredContacts.length}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}
