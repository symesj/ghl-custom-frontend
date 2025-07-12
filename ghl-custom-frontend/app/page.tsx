"use client";

import { EnvelopeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div
        className={`max-w-3xl w-full text-center transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png" // 👈 Make sure you've uploaded your logo to public/logo.png
            alt="Fastline Group Logo"
            width={120}
            height={120}
            className="rounded-full"
            priority
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to Fast AI Boss
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          Automate, analyze, and scale your business with a futuristic GHL dashboard.
        </p>

        <div className="flex justify-center">
          <a
            href="mailto:sales@fastlinegroup.com"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition duration-300"
          >
            <EnvelopeIcon className="w-5 h-5" />
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}
