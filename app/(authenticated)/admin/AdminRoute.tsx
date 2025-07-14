"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../../firebase";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role === "admin") {
          setLoading(false); // ✅ Let them in
        } else {
          router.push("/dashboard"); // ⛔ Kick non-admins out
        }
      } else {
        router.push("/login"); // ⛔ Not logged in
      }
    });

    return () => unsubscribe();
  }, [auth, db, router]);

  if (loading) return <p>Checking admin access...</p>;
  return <>{children}</>;
}
