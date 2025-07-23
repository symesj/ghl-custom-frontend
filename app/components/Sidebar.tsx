'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type SidebarProps = {
  role?: 'admin' | 'user' | null;
  onLogoutAction?: () => void;
  subAccountId?: string | null; // ✅ Add this to match layout.tsx
};

export default function Sidebar({ role = null, onLogoutAction, subAccountId = null }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const baseNav = [
    { label: '🏠 Dashboard', href: '/dashboard' },
    { label: '📇 Contacts', href: '/contacts' },
    { label: '🧲 Sales', href: '/opportunities' },
    { label: '📊 Analytics', href: '/charts' },
  ];

  const adminNav = role === 'admin' ? [{ label: '⚙️ Settings', href: '/settings' }] : [];
  const navItems = role ? [...baseNav, ...adminNav] : [];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-pink-600 text-white px-3 py-2 rounded-md shadow-lg"
        >
          ☰ Menu
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`absolute top-0 left-0 h-full w-64 bg-[#0f0c29] text-white shadow-lg transform z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:flex`}
      >
        <div className="flex flex-col justify-between h-full py-6">
          <div className="flex flex-col items-center">
            <div className="mb-10">
              <Image
                src="/fastline-logo.png"
                alt="Fast AI Boss"
                width={180}
                height={80}
                className="object-contain h-auto w-auto"
                priority
              />
            </div>

            <nav className="flex flex-col gap-4 w-full px-6">
              {navItems.length > 0 ? (
                navItems.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 rounded-md transition font-medium ${
                      pathname === href
                        ? 'bg-pink-600 text-white'
                        : 'hover:bg-[#302b63] text-gray-300'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md transition font-medium text-center bg-pink-600 hover:bg-pink-700 text-white"
                >
                  🔐 Login
                </Link>
              )}
            </nav>

            {/* Optional subAccountId debug display */}
            {subAccountId && (
              <p className="text-xs text-gray-400 text-center px-6 mt-4">
                Subaccount ID: {subAccountId}
              </p>
            )}
          </div>

          {role && onLogoutAction && (
            <button
              onClick={() => {
                setIsOpen(false);
                onLogoutAction();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mx-6 mt-10 rounded"
            >
              🚪 Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}