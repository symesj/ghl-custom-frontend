"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { auth } from "@/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMsg("No account found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMsg("Incorrect password.");
          break;
        case "auth/invalid-email":
          setErrorMsg("Please enter a valid email.");
          break;
        default:
          setErrorMsg("Login failed. Try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const signupWithEmail = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created!");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6 relative overflow-hidden">
      <Image
        src="/fastline-logo.png"
        alt="Fastline Logo"
        width={200}
        height={60}
        className="mb-8"
        priority
      />

      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
        Welcome to Fast AI Boss
      </h1>

      <p className="text-lg sm:text-xl text-center text-gray-300 max-w-xl">
        The ultimate AI-powered front-end for GoHighLevel. Designed for speed, elegance, and control.
      </p>

      <div className="flex flex-col gap-3 items-center mt-10 w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 text-black rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 text-black rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

        <button
          onClick={handleLogin}
          className="bg-green-600 px-4 py-2 rounded text-white w-full"
        >
          Login with Email
        </button>

        <button
          onClick={signupWithEmail}
          className="bg-blue-600 px-4 py-2 rounded text-white w-full"
        >
          Sign Up
        </button>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="mt-6 inline-block px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-700 transition duration-300 text-white font-semibold shadow-lg"
      >
        Login with Google
      </button>

      <a
        href="mailto:sales@fastlinegroup.com"
        className="mt-6 inline-block px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition duration-300 text-white font-semibold shadow-lg"
      >
        Contact Sales
      </a>

      <Player
        autoplay
        loop
        src="/butler.json"
        style={{ height: "300px", width: "300px" }}
        className="mt-10 animate-fade-in"
      />

      <div className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-pink-600 blur-3xl opacity-20 top-10 left-20 animate-pulse"></div>
      <div className="absolute -z-10 w-[400px] h-[400px] rounded-full bg-cyan-500 blur-3xl opacity-20 bottom-10 right-20 animate-pulse"></div>
    </div>
  );
}