'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc
} from 'firebase/firestore';

import {
  getFunctions,
  httpsCallable
} from 'firebase/functions';

import { app } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Step 1: Login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Look up subAccountId from Firestore
      const userDoc = await getDoc(doc(db, 'users', email)); // or use user.uid
      if (!userDoc.exists()) throw new Error('User not found in Firestore');
      const { subAccountId } = userDoc.data();

      if (!subAccountId) throw new Error('No subAccountId set');

      // Step 3: Call Cloud Function to set custom claims
      const setClaims = httpsCallable(functions, 'setCustomClaims');
      await setClaims({ uid: user.uid, subAccountId });

      // Step 4: Refresh token
      await user.getIdToken(true);

      // Step 5: Go to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-20 p-6 bg-white/10 backdrop-blur rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Welcome to Fast AI Boss</h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-4 text-black rounded bg-white"
        placeholder="Email"
        autoComplete="email"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 mb-6 text-black rounded bg-white"
        placeholder="Password"
        autoComplete="current-password"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-green-600 p-3 rounded hover:bg-green-700 text-white font-bold transition disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login with Email'}
      </button>
    </div>
  );
}