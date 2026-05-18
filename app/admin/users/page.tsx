import UserTable from "@/components/admin/user-table";

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Manage Users</h1>
        <p className="text-sm text-[#64748b] mt-1">
          View, edit, and manage all users on the platform.
        </p>
      </header>
      <div className="border-b border-[#e2e8f0] mb-6"></div>

      <UserTable />
    </div>
  );
}
