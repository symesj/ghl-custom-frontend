"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "@/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with that email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1044] text-white flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 bg-[#2B1A5B] rounded-xl shadow-lg text-center space-y-4">
        <img src="/fastline-logo.png" alt="Fastline Logo" className="mx-auto w-40 mb-2" />

        <h1 className="text-2xl font-bold">Welcome to Fast AI Boss</h1>
        <p className="text-sm text-gray-300">
          The ultimate AI-powered front-end for GoHighLevel.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-white text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-white text-black"
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login with Email
        </button>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          Sign Up
        </button>

        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded">
          Login with Google
        </button>

        <a
          href="mailto:sales@fastlinegroup.com"
          className="inline-block w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
        >
          Contact Sales
        </a>
      </div>
    </div>
  );
}