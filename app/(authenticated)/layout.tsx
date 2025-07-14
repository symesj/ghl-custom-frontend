"use client";

import Sidebar from "../components/Sidebar";
import "../globals.css";
import { useRouter } from "next/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    // Optional: add Firebase logout here if needed
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar role="admin" onLogoutAction={handleLogout} />
      <main className="flex-1 md:ml-64 overflow-y-auto p-6">{children}</main>
    </div>
  );
}