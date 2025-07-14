"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role: "admin" | "user";
  onLogoutAction: () => void;
};

export default function Sidebar({ role, onLogoutAction }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "🏠 Dashboard", href: "/dashboard" },
    { label: "📇 Contacts", href: "/contacts" },
    { label: "🧲 Opportunities", href: "/opportunities" },
    { label: "📊 Analytics", href: "/charts" },
    ...(role === "admin"
      ? [{ label: "⚙️ Settings", href: "/settings" }]
      : []),
  ];

  return (
    <aside className="w-64 h-screen bg-[#0f0c29] text-white fixed top-0 left-0 flex flex-col justify-between py-6 shadow-lg z-50">
      <div className="flex flex-col items-center">
        <div className="mb-10">
          <Image
            src="/fastline-logo.png"
            alt="Fast AI Boss"
            width={180}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        <nav className="flex flex-col gap-4 w-full px-6">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-md transition font-medium ${
                pathname === href
                  ? "bg-pink-600 text-white"
                  : "hover:bg-[#302b63] text-gray-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={onLogoutAction}
        className="mt-10 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mx-6 rounded"
      >
        🚪 Logout
      </button>
    </aside>
  );
}