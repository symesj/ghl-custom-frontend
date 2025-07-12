"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Glow ring effect */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Image src="/logo.png" alt="Fastline Group Logo" width={140} height={40} />
      </div>

      {/* AI Butler Animation */}
      <Player
        autoplay
        loop
        src="/animations/butler.json"
        style={{ height: "300px", width: "300px" }}
        className="z-10 mb-4"
      />

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center tracking-tight mb-4 z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
        Welcome to GHL Custom Frontend
      </h1>

      {/* Subtext */}
      <p className="text-lg sm:text-xl text-center text-gray-300 max-w-2xl mb-8 z-10">
        Tailored, secure, and blazing fast. Powered by Next.js, Firebase & Fastline Group.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <Link
          href="/login"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:brightness-110 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all"
        >
          Login
        </Link>
        <a
          href="mailto:sales@fastlinegroup.com"
          className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold shadow-md transition"
        >
          Contact Sales
        </a>
      </div>
    </div>
  );
}
