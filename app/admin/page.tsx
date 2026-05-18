import Link from "next/link";
import { Users, Building2, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Admin Dashboard</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Platform-wide management and statistics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0d1b2a]">1,250</p>
            <p className="text-sm text-[#64748b]">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0d1b2a]">42</p>
            <p className="text-sm text-[#64748b]">Active Clubs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0d1b2a]">8</p>
            <p className="text-sm text-[#64748b]">Universities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h3 className="font-bold text-[#0d1b2a] mb-2">Quick Actions</h3>
          <div className="flex flex-col space-y-3">
            <Link href="/admin/users" className="font-semibold text-amber-600 hover:text-amber-700">Manage Users</Link>
            <Link href="/admin/universities" className="font-semibold text-amber-600 hover:text-amber-700">Manage Universities</Link>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h3 className="font-bold text-[#0d1b2a] mb-2">System Status</h3>
          <p className="text-sm text-[#64748b]">All systems operational.</p>
        </div>
      </div>
    </div>
  );
}
