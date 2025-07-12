"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { app } from "@/firebase";

interface UserActivity {
  email: string;
  role: string;
  createdAt: { seconds: number };
}

export default function UserActivityFeed() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchActivity = async () => {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(usersQuery);
      const data: UserActivity[] = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data() as UserActivity);
      });

      setActivities(data);
    };

    fetchActivity();
  }, []);

  return (
    <div className="mt-10 text-left">
      <h2 className="text-xl font-bold mb-4">Recent User Activity</h2>
      <ul className="space-y-2">
        {activities.map((user, index) => (
          <li key={index} className="bg-gray-700 p-3 rounded">
            <p className="font-semibold">{user.email}</p>
            <p className="text-sm text-gray-300">Role: {user.role}</p>
            <p className="text-xs text-gray-400">
              Joined: {new Date(user.createdAt.seconds * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
