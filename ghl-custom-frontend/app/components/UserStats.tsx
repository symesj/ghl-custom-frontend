"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/firebase";

export default function UserStats() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [admins, setAdmins] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const db = getFirestore(app);
      const usersSnapshot = await getDocs(collection(db, "users"));
      let adminCount = 0;

      usersSnapshot.forEach((doc) => {
        if (doc.data().role === "admin") {
          adminCount++;
        }
      });

      setTotalUsers(usersSnapshot.size);
      setAdmins(adminCount);
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">User Stats</h2>
      <p className="text-sm text-gray-300">Total Users: {totalUsers}</p>
      <p className="text-sm text-gray-300">Admins: {admins}</p>
      <p className="text-sm text-gray-300">Users: {totalUsers - admins}</p>
    </div>
  );
}
