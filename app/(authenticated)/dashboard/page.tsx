"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { app } from "@/firebase";
import Sidebar from "@/app/components/Sidebar";

export default function UserDashboard() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const [contacts, setContacts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [recentAutomations, setRecentAutomations] = useState([]);

  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");

        const apiKey = userData.ghlApiKey;
        if (apiKey) {
          await Promise.all([
            fetchContacts(apiKey),
            fetchOpportunities(apiKey),
            fetchAppointments(apiKey),
            fetchAutomations(apiKey),
          ]);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchContacts = async (apiKey: string) => {
    const res = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setContacts(data.contacts || []);
  };

  const fetchOpportunities = async (apiKey: string) => {
    const res = await fetch("https://rest.gohighlevel.com/v1/opportunities/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setOpportunities(data.opportunities || []);
  };

  const fetchAppointments = async (apiKey: string) => {
    const res = await fetch("https://rest.gohighlevel.com/v1/appointments/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

  const fetchAutomations = async (apiKey: string) => {
    const res = await fetch("https://rest.gohighlevel.com/v1/workflows/executions/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setRecentAutomations(data.executions?.slice(0, 5) || []);
  };

  const SkeletonCard = () => (
    <div className="bg-gray-800 p-6 rounded shadow animate-pulse h-32" />
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-900 text-white p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome, {name || "User"} 👋</h1>
        <p className="text-gray-400 mb-6">
          You're logged in as: <strong>{email}</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <Link href="/contacts">
                <div className="cursor-pointer bg-gray-800 p-6 rounded shadow hover:bg-gray-700 transition">
                  <h2 className="text-xl font-bold mb-2">📇 Contacts</h2>
                  <p className="text-gray-300 text-sm">Total: {contacts.length}</p>
                </div>
              </Link>

              <Link href="/opportunities">
                <div className="cursor-pointer bg-gray-800 p-6 rounded shadow hover:bg-gray-700 transition">
                  <h2 className="text-xl font-bold mb-2">💼 Opportunities</h2>
                  <p className="text-gray-300 text-sm">Open: {opportunities.length}</p>
                </div>
              </Link>

              <Link href="/appointments">
                <div className="cursor-pointer bg-gray-800 p-6 rounded shadow hover:bg-gray-700 transition">
                  <h2 className="text-xl font-bold mb-2">📅 Appointments</h2>
                  <p className="text-gray-300 text-sm">Upcoming: {appointments.length}</p>
                </div>
              </Link>

              <div className="bg-gray-800 p-6 rounded shadow col-span-1 sm:col-span-2">
                <h2 className="text-xl font-bold mb-3">⚙️ Recent Automations</h2>
                {recentAutomations.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {recentAutomations.map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.workflowName || "Unnamed Workflow"} –{" "}
                        {new Date(item.createdAt).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No recent automation activity found.</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}