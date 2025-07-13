// app/(authenticated)/layout.tsx
import Sidebar from "@/app/components/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}