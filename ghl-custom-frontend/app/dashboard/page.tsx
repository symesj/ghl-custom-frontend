"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import Navbar from "../components/Navbar";

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
    <>
      <Navbar email={email} />
      <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl mt-10 bg-gray-800 p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-4">Welcome, {name || "User"} 👋</h1>
          <p className="text-gray-400">You're logged in as <span className="font-semibold">{email}</span></p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Activity</h2>
              <p className="text-gray-300 text-sm">No recent activity yet.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Updates</h2>
              <p className="text-gray-300 text-sm">Stay tuned for system updates.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
