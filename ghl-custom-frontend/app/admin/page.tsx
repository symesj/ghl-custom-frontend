"use client";

import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";

export default function AdminDashboard() {
  const { email, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!email || role !== "admin") {
      router.push("/login");
    }
  }, [email, role, router]);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-gray-900 p-10 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-4 text-purple-400">Admin Dashboard</h1>
        <p className="mb-2">
          <span className="font-semibold">Welcome, admin!</span>
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {email}
        </p>
        <p className="mb-6">
          <span className="font-semibold">Role:</span> {role}
        </p>

        <button
          onClick={handleLogout}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
