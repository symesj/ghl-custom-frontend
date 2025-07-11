"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";
import { useEffect } from "react";

export default function Dashboard() {
  const { email, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!email) router.push("/login");
  }, [email, router]);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        <p className="mb-2">
          <span className="font-semibold">Welcome!</span>
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {email}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Role:</span> {role}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
