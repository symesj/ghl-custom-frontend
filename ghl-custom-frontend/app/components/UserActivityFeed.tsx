"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase";

export default function UserActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        role: doc.data().role,
        createdAt: doc.data().createdAt?.toDate()?.toLocaleString(),
      }));
      setActivities(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md mt-10">
      <h3 className="text-lg font-semibold mb-3">Recent User Activity</h3>
      <ul className="space-y-2">
        {activities.map((user) => (
          <li key={user.id} className="text-sm border-b pb-2">
            <strong>{user.email}</strong> ({user.role}) – <em>{user.createdAt}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
