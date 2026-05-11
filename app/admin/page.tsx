import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // Fetch stats and recent data from Prisma
  const [
    userCount,
    clubCount,
    membershipCount,
    eventCount,
    recentClubs,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.club.count(),
    prisma.membership.count(),
    prisma.event.count(),
    prisma.club.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { memberships: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Platform overview and recent activity"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard title="Students" value={userCount} icon="IconUsersGroup" />
        <StatCard
          title="Clubs"
          value={clubCount}
          icon="IconBuildingCommunity"
        />
        <StatCard
          title="Memberships"
          value={membershipCount}
          icon="IconIdBadge2"
        />
        <StatCard title="Events" value={eventCount} icon="IconCalendarEvent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Recent Clubs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="px-6 py-4 border-b bg-[#0d1b3e] text-white text-xs font-semibold uppercase tracking-wider">
            Recent Clubs
          </div>
          <table className="min-w-[420px] w-full text-sm">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-2 py-3 text-left font-semibold">Members</th>
                <th className="px-2 py-3 text-left font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentClubs.map((club, i) => (
                <tr
                  key={club.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}
                >
                  <td className="px-6 py-3 text-[#111827] font-medium">
                    <Link
                      href="/admin/clubs"
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                    >
                      {club.name}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-[#4b5563]">
                    {club._count.memberships}
                  </td>
                  <td className="px-2 py-3 text-[#4b5563]">
                    {club.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Students Table */}
        <div className="bg-white rounded-lg shadow border p-0 overflow-hidden">
          <div className="px-6 py-4 border-b text-lg font-semibold text-[var(--navy,#0d1b3e)] bg-[#f7f5f0]">
            Recent Students
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f5f0] text-[#1a1a2e]">
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-2 py-3 text-left font-semibold">Email</th>
                <th className="px-2 py-3 text-left font-semibold">Role</th>
                <th className="px-2 py-3 text-left font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <tr
                  key={user.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#f7f5f0]"}
                >
                  <td className="px-6 py-3">
                    <Link
                      href="/admin/students"
                      className="text-[var(--navy,#0d1b3e)] font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-2 py-3">{user.email}</td>
                  <td className="px-2 py-3">{user.role}</td>
                  <td className="px-2 py-3">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
