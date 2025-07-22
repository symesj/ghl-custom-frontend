import "./globals.css";
import type { Metadata } from "next";

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
      <head>
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
        <link rel="icon" href="/icon-192.png" />
        <meta name="theme-color" content="#121212" />
      </head>
      <body>{children}</body>
    </html>
  );
}