// app/(authenticated)/login/page.tsx

'use client';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard'); // or contacts
    } catch (error) {
      alert('❌ Login failed');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to Fast AI Boss</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 text-black rounded"
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 text-black rounded"
        placeholder="Password"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-green-600 p-2 rounded hover:bg-green-700"
      >
        Login with Email
      </button>
    </div>
  );
}
