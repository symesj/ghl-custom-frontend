import DashboardStats from "@/app/components/DashboardStats";
import UserChart from "@/app/components/UserChart";
import UserActivityFeed from "@/app/components/UserActivityFeed";
import UserRoleBreakdown from "@/app/components/UserRoleBreakdown";
import SystemLogs from "@/app/components/SystemLogs";

export default function AdminDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <DashboardStats />
      <UserChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserRoleBreakdown />
        <UserActivityFeed />
      </div>
      <SystemLogs />
    </div>
  );
}
