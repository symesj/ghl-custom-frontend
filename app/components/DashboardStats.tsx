"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase";
import { fetchOpportunities, getAllContacts } from "@/lib/ghl";

type Opportunity = {
  id: string;
  name?: string;
  status?: string;
  value?: number;
};

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContacts: 0,
    activeSessions: 0,
    conversionRate: 0,
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Firebase users
  useEffect(() => {
    const db = getFirestore(app);
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalUsers: snapshot.size,
      }));
    });

    return () => unsubUsers();
  }, []);

  // Firestore contacts (replaces GHL call)
  useEffect(() => {
    const db = getFirestore(app);
    const contactsRef = collection(db, "ghl_contacts");

    getDocs(contactsRef).then((snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalContacts: snapshot.size,
      }));
    });
  }, []);

  // Manual sync function
  const handleContactSync = async () => {
    const key = apiKey || process.env.NEXT_PUBLIC_GHL_API_KEY || "";
    if (!key) return alert("Missing GHL API key");

    const db = getFirestore(app);
    const contacts = await getAllContacts(key);

    const batchWrites = contacts.map((contact) => {
      const docRef = collection(db, "ghl_contacts");
      return addDoc(docRef, {
        ghlId: contact.id,
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
      });
    });

    await Promise.all(batchWrites);
    alert("✅ Contacts synced to Firestore!");
  };

  // GHL opportunities
  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      const key = snap.data()?.ghlApiKey || process.env.NEXT_PUBLIC_GHL_API_KEY || "";
      if (key) {
        setApiKey(key);
        const data = await fetchOpportunities(key);
        setOpportunities(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const displayStats = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Contacts", value: stats.totalContacts },
    { label: "Active Sessions", value: stats.activeSessions },
    { label: "Conversion Rate", value: `${stats.conversionRate}%` },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <div
            key={i}
            className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 shadow-lg"
          >
            <p className="text-sm uppercase tracking-wide">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleContactSync}
        className="self-start px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
      >
        🔄 Sync GHL Contacts to Firestore
      </button>

      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Latest Opportunities
        </h3>
        {loading ? (
          <p className="text-gray-400">Loading opportunities...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-gray-800 p-4 rounded">
                <p className="font-bold text-white">
                  {opp.name || "Unnamed"}
                </p>
                <p className="text-gray-400 text-sm">{opp.status}</p>
                <p className="text-gray-400 text-sm">
                  Value: £{opp.value ?? 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}