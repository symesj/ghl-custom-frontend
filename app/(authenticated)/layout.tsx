'use client';

import Sidebar from '../components/Sidebar';
import '../globals.css';

import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { app } from '@/firebase';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [subAccountId, setSubAccountId] = useState<string | null>(null);
  const [ghlApiKey, setGhlApiKey] = useState<string | null>(null);

  const isLoginPage = pathname === '/login';

  const handleLogout = () => {
    signOut(auth);
    router.push('/login');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;

      if (!user && !isLoginPage) {
        router.push('/login');
        return;
      }

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.warn(`❌ No user document found for UID ${user.uid}`);
          return;
        }

        const userData = userSnap.data();
        const userRole = userData?.role || 'user';
        const subId = userData?.subAccountId;

        setRole(userRole);
        setSubAccountId(subId);

        if (subId) {
          const subRef = doc(db, 'subaccounts', subId);
          const subSnap = await getDoc(subRef);
          const ghlKey = subSnap.data()?.ghlApiKey;

          if (!ghlKey) {
            console.warn(`⚠️ No GHL API key found for subaccount ${subId}`);
          } else {
            setGhlApiKey(ghlKey);
          }
        }
      }

      setCheckingAuth(false);
    };

    const unsubscribe = onAuthStateChanged(auth, checkAuth);
    return () => unsubscribe();
  }, [pathname]);

  if (checkingAuth && !isLoginPage) {
    return <div className="p-8 text-white">🔄 Checking authentication...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {!isLoginPage && (
        <Sidebar
          role={role}
          onLogoutAction={handleLogout}
          subAccountId={subAccountId}
        />
      )}

      <main className={`flex-1 ${!isLoginPage ? 'md:ml-64' : ''} overflow-y-auto p-6`}>
        {children}
      </main>
    </div>
  );
}