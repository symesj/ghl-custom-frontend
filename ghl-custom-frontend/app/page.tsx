"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { app } from "@/firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Fast AI Boss</h1>
        {user ? (
          <>
            {profile?.avatar && (
              <img
                src={profile.avatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
            )}
            <p className="text-lg font-semibold mb-1">{profile?.name || "User"}</p>
            <p className="text-sm text-gray-300">{user.email}</p>
            <p className="text-xs mt-2 text-purple-400">Role: {profile?.role || "User"}</p>
            <button
              onClick={handleLogout}
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 transition rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <p className="text-gray-400">Please login to see your dashboard.</p>
        )}
      </div>
    </div>
  );
}
