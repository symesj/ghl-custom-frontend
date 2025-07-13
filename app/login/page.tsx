"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";

// Load Lottie without SSR
const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then(mod => mod.Player), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
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

  const handleSignup = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1D1044] text-white">
      {/* Left Side: Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <Image src="/fastline-logo.png" alt="Fastline Logo" width={160} height={50} className="mb-6" />

        <h1 className="text-3xl font-bold mb-2 text-center">Welcome to Fast AI Boss</h1>
        <p className="text-center text-gray-300 mb-6">The ultimate AI-powered front-end for GoHighLevel.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-sm p-3 mb-3 rounded bg-white text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-sm p-3 mb-3 rounded bg-white text-black"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 mb-3 rounded"
        >
          Login with Email
        </button>

        <button
          onClick={handleSignup}
          className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 mb-3 rounded"
        >
          Sign Up
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full max-w-sm bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 mb-3 rounded"
        >
          Login with Google
        </button>

        <a
          href="mailto:sales@fastlinegroup.com"
          className="w-full max-w-sm inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded text-center"
        >
          Contact Sales
        </a>
      </div>

      {/* Right Side: Animation */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#2B1A5B] p-6">
        {/* @ts-ignore */}
        <Player
          autoplay
          loop
          src="/butler.json"
          style={{ height: "400px", width: "400px" }}
        />
      </div>
    </div>
  );
}