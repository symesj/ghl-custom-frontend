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
      <body>{children}</body>
    </html>
  );
}