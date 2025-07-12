"use client";

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebase";

interface NavbarProps {
  email?: string;
}

export default function Navbar({ email }: NavbarProps) {
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-950 border-b border-gray-800 p-4 flex justify-between items-center shadow-sm">
      <div className="text-xl font-bold text-white">GHL Custom Frontend</div>
      <div className="flex items-center gap-4">
        {email && <span className="text-sm text-gray-400 hidden sm:inline">{email}</span>}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
