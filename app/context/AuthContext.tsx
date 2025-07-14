"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase";

type AuthContextType = {
  email: string;
  role: string;
};

const AuthContext = createContext<AuthContextType>({ email: "", role: "" });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email || "");
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const userRole = docSnap.exists() ? docSnap.data().role || "user" : "user";
        setRole(userRole);
      } else {
        setEmail("");
        setRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ email, role }}>
      {children}
    </AuthContext.Provider>
  );
};
