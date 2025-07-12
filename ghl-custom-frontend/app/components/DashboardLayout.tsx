"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-6">{isAdmin ? "Admin Panel" : "User Panel"}</h2>
        <nav className="flex flex-col gap-4">
          <Link href={isAdmin ? "/admin" : "/dashboard"} className="hover:text-blue-400">
            Dashboard
          </Link>
          {isAdmin && (
            <Link href="/admin/settings" className="hover:text-blue-400">
              Settings
            </Link>
          )}
          <Link href="/login" className="mt-auto text-red-400 hover:text-red-600">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">{children}</main>
    </div>
  );
}
