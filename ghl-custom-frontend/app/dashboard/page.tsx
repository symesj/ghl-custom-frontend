"use client";

import UserChart from "@/app/components/UserChart";
import DashboardStats from "@/app/components/DashboardStats";

export default function DashboardPage() {
  return (
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Dashboard</h1>
      
      <DashboardStats />

      <div className="mt-10">
        <UserChart />
      </div>
    </div>
  );
}
