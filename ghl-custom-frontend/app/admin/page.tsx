"use client";

import SystemLogs from "../components/SystemLogs";
import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import UserStats from "../components/UserStats";
import UserActivityFeed from "../components/UserActivityFeed";

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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

      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name || "");

        if (userData.role !== "admin") {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome, {name || "Admin"} — {email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </header>

        <UserStats />
        <UserActivityFeed />
        <SystemLogs />
      </div>
    </div>
  );
}
