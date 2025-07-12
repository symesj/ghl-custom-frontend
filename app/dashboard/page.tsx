"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import Sidebar from "../components/Sidebar";

export default function UserDashboard() {
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
        setName(docSnap.data().name || "");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, {name || "User"} 👋</h1>
        <p className="text-gray-400">You're logged in as: <strong>{email}</strong></p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded shadow">🚧 Feature 1</div>
          <div className="bg-gray-800 p-6 rounded shadow">📊 Analytics coming soon</div>
        </div>
      </main>
    </div>
  );
}
