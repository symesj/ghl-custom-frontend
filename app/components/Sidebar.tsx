"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "🏠 Dashboard", href: "/" },
  { label: "📇 Contacts", href: "/contacts" },
  { label: "🧲 Opportunities", href: "/opportunities" }, // ✅ ADD BACK
  { label: "📊 Analytics", href: "/charts" },
  { label: "⚙️ Settings", href: "/settings" },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0f0c29] text-white fixed top-0 left-0 flex flex-col items-center py-6 shadow-lg z-50">
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
    </aside>
  );
}
