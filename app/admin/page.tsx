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
    prisma.user.count({ where: { role: "USER" } }),
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
      where: { NOT: { role: "ADMIN" } },
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#111827] px-4 py-3 text-gray-300 text-xs font-semibold uppercase tracking-wider">
            Recent Clubs
          </div>
          <table className="w-full min-w-105 text-sm">
            <thead>
              <tr className="bg-[#111827]">
                <th className="text-gray-300 text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left">
                  Name
                </th>
                <th className="text-gray-300 text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left">
                  Members
                </th>
                <th className="text-gray-300 text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {recentClubs.map((club, i) => (
                <tr
                  key={club.id}
                  className={
                    i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 hover:bg-blue-50 transition-colors duration-150"
                  }
                >
                  <td className="text-[#111827] font-medium px-4 py-3">
                    <Link
                      href="/admin/clubs"
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                    >
                      {club.name}
                    </Link>
                  </td>
                  <td className="text-[#4b5563] px-4 py-3">
                    {club._count.memberships}
                  </td>
                  <td className="text-[#4b5563] px-4 py-3">
                    {club.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#111827] px-4 py-3 text-gray-300 text-xs font-semibold uppercase tracking-wider">
            Recent Students
          </div>
          <table className="w-full min-w-105 text-sm">
            <thead>
              <tr className="bg-[#111827]">
                <th className="text-gray-300 text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left">
                  Name
                </th>
                <th className="text-gray-300 text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left">
                  Email
                </th>
                <th className="text-gray-300 text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left">
                  Role
                </th>
                <th className="text-gray-300 text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <tr
                  key={user.id}
                  className={
                    i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 hover:bg-blue-50 transition-colors duration-150"
                  }
                >
                  <td className="text-[#111827] font-medium px-4 py-3">
                    <Link
                      href="/admin/students"
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="text-[#4b5563] px-4 py-3">{user.email}</td>
                  <td className="text-[#4b5563] px-4 py-3">{user.role}</td>
                  <td className="text-[#4b5563] px-4 py-3">
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
