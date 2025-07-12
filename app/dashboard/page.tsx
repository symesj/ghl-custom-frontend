"use client";

import { useRouter } from "next/router"; // ✅
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in!");
      router.replace("/dashboard"); // ✅ THIS SHOULD WORK
    } catch (error) {
      console.error("❌ Email login error:", error);
    }
  };

  // ...
}
