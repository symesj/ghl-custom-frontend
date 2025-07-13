"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "@/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#1D1044] text-white">
      <div className="m-auto w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Fast AI Boss</h1>
        <p className="mb-6 text-sm">
          The ultimate AI-powered front-end for GoHighLevel. Designed for speed, elegance, and control.
        </p>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-white text-black mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
          />
        </div>

        {error && <div className="text-red-500 mb-3">{error}</div>}

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login with Email
        </button>

        {/* 🧠 Move Butler Image Here */}
        <div className="mt-8 flex justify-center">
          <img src="/file.svg" alt="Butler" className="w-32 h-32" />
        </div>
      </div>
    </div>
  );
}