import "./globals.css";
import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Fast AI Boss",
  description: "The ultimate AI-powered front-end for GoHighLevel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#121212" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <body>{children}</body>
    </html>
  );
}