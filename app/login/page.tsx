"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

import { auth } from "@/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/firebase";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginWithEmail = async () => {
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Email login error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMsg("No account found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMsg("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setErrorMsg("Please enter a valid email address.");
          break;
        default:
          setErrorMsg("Login failed. Please try again.");
          break;
      }
    }
  };

  const signupWithEmail = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const domain = email.split("@")[1];
      const subaccountId =
        domain === "fastlinegroup.com" ? "fastline-abc123" : "default-subaccount";

      await setDoc(doc(getFirestore(app), "users", user.uid), {
        email: user.email,
        name: email.split("@")[0],
        role: "user",
        subaccountId,
      });

      alert("✅ Account created and assigned to subaccount!");
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Signup error:", error);
      alert("Signup failed.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Google login error:", error);
    }
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
      {/* 🔮 Background Glows */}
      <div className="absolute -z-10 w-[400px] h-[400px] bg-pink-600 blur-3xl opacity-20 rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute -z-10 w-[400px] h-[400px] bg-cyan-500 blur-3xl opacity-20 rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* LEFT SIDE – Login Form */}
      <div className="flex flex-col justify-center items-center px-6 py-12 md:px-12">
        <Image
          src="/fastline-logo.png"
          alt="Fastline Group Logo"
          width={180}
          height={50}
          className="mb-6"
          priority
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2">
          Welcome to Fast AI Boss
        </h1>
        <p className="text-sm sm:text-base text-center text-gray-300 mb-6 max-w-sm">
          The ultimate AI-powered front-end for Business Automation. Designed for speed,
          elegance, and control.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
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
          {errorMsg && <p className="text-red-500 text-sm text-center mt-1">{errorMsg}</p>}

          <button onClick={loginWithEmail} className="bg-green-600 px-4 py-2 rounded text-white w-full">
            Login with Email
          </button>
          <button onClick={signupWithEmail} className="bg-blue-600 px-4 py-2 rounded text-white w-full">
            Sign Up
          </button>
          <button onClick={handleGoogleLogin} className="bg-cyan-600 px-4 py-2 rounded text-white w-full">
            Login with Google
          </button>
          <a
            href="mailto:sales@fastlinegroup.com"
            className="text-center bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white w-full"
          >
            Contact Sales
          </a>
        </div>
      </div>

      {/* RIGHT SIDE – Butler */}
      <div className="hidden md:flex justify-center items-center">
        <Player
          autoplay
          loop
          src="/butler.json"
          style={{ height: "400px", width: "400px" }}
          className="animate-fade-in"
        />
      </div>
    </div>
  );
}