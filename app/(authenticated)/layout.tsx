// app/(authenticated)/layout.tsx
import Sidebar from "../components/Sidebar";
import "../globals.css";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}