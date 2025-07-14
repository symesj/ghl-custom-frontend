"use client";

import Sidebar from "@/app/components/Sidebar";
import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { app } from "@/firebase";

export default function DashboardPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [role, setRole] = useState<"admin" | "user">("user");
  const [subaccountId, setSubaccountId] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogoutAction = async () => {
    await signOut(auth);
    router.push("/login");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push("/login");

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setRole(data.role || "user");
        setSubaccountId(data.subaccountId || "");
        fetchContacts(data.ghlApiKey);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchContacts = async (apiKey: string) => {
    if (!apiKey) return;

    try {
      const res = await fetch("https://rest.gohighlevel.com/v1/contacts", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      // ✅ Normalize contacts with fallbacks
      const normalizedContacts = (data.contacts || []).map((c: any) => ({
        id: c.id,
        firstName: c.firstName || "",
        lastName: c.lastName || "",
        email: c.email || "",
      }));

      setContacts(normalizedContacts);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} onLogoutAction={handleLogoutAction} />

      <main className="flex-1 bg-gray-900 text-white p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-400 mb-6">Subaccount: {subaccountId || "N/A"}</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.length > 0 ? (
              contacts.map((contact: any) => (
                <div key={contact.id} className="bg-gray-800 p-4 rounded shadow">
                  <h3 className="text-lg font-bold">
                    {`${contact.firstName} ${contact.lastName}`.trim() || contact.email || "Unnamed"}
                  </h3>
                  <p className="text-sm text-gray-400">{contact.email}</p>
                </div>
              ))
            ) : (
              <p>No contacts found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}