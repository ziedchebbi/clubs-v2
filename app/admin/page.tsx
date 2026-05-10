import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview and quick stats."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <StatCard title="Clubs" value="-" />
        <StatCard title="Students" value="-" />
        <StatCard title="Events" value="-" />
      </div>
    </div>
  );
}
