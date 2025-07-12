import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar"; // 👈 Add this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fast AI Boss",
  description: "The ultimate AI-powered front-end for GoHighLevel",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <AuthProvider>
          <Sidebar />
          <main className="ml-64 w-full min-h-screen bg-[#121212] p-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
