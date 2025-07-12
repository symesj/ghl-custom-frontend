"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    const db = getFirestore(app);

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalUsers: snapshot.size,
      }));
    });

    // Optional: set up activeSessions & conversionRate logic as needed

    return () => {
      unsubUsers();
    };
  }, []);

  const displayStats = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Active Sessions", value: stats.activeSessions },
    { label: "Conversion Rate", value: `${stats.conversionRate}%` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
  );
}
