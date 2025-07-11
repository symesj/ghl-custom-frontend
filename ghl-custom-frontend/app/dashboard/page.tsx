"use client";

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "../../firebase";
import UserRoute from "./UserRoute";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || "");
      // Optional: fetch role if needed for UI
    }
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <UserRoute>
      <div style={{ padding: 40 }}>
        <h1>Welcome to the Dashboard!</h1>
        <p>This is your protected space.</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Role:</strong> user</p>
        <button onClick={handleLogout} style={{ marginTop: 20, padding: 10 }}>
          Logout
        </button>
      </div>
    </UserRoute>
  );
}
