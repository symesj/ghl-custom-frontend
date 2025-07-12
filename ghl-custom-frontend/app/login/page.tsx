"use client";

import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { app } from "../../firebase";

export default function Login() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let userCredential;

      if (isNewUser) {
        // Register
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          role: "user",
          createdAt: new Date(),
        });

        // 🔥 Log signup event
        await setDoc(doc(db, "logs", `${userCredential.user.uid}_signup`), {
          event: `User registered: ${userCredential.user.email}`,
          timestamp: serverTimestamp(),
        });

      } else {
        // Login
        userCredential = await signInWithEmailAndPassword(auth, email, password);

        // 🔥 Log login event
        await setDoc(doc(db, "logs", `${userCredential.user.uid}_login_${Date.now()}`), {
          event: `User logged in: ${userCredential.user.email}`,
          timestamp: serverTimestamp(),
        });
      }

      // Role-based redirect
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const role = userDoc.data()?.role;

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold mb-4">
        {isNewUser ? "Sign Up" : "Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isNewUser ? "Create Account" : "Log In"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        {isNewUser ? "Already have an account?" : "Need an account?"}{" "}
        <button
          onClick={() => setIsNewUser(!isNewUser)}
          className="text-blue-600 underline ml-1"
        >
          {isNewUser ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
