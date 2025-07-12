"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase";

export default function UserRoleBreakdown() {
  const [counts, setCounts] = useState<{ [role: string]: number }>({});

  useEffect(() => {
    const db = getFirestore(app);

    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const roleCounts: { [role: string]: number } = {};
      snapshot.forEach((doc) => {
        const role = doc.data().role || "unknown";
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      setCounts(roleCounts);
    });

    return () => unsub();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md mt-10">
      <h3 className="text-lg font-semibold mb-3">User Roles</h3>
      <ul className="text-sm space-y-1">
        {Object.entries(counts).map(([role, count]) => (
          <li key={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}: <strong>{count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
