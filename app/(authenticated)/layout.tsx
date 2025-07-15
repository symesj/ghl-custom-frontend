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
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userRole = userDoc.data()?.role || 'user';
        setRole(userRole);
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
      {/* ✅ Smart Sidebar with dynamic role */}
      {!isLoginPage && <Sidebar role={role} onLogoutAction={handleLogout} />}

      <main className={`flex-1 ${!isLoginPage ? 'md:ml-64' : ''} overflow-y-auto p-6`}>
        {children}
      </main>
    </div>
  );
}
