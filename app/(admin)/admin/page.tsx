import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EUserRole } from "@/generated/prisma/enums";
import { Building2, Users, ClipboardList, CalendarDays } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { university: true },
  });

  if (!user || user.role !== EUserRole.ADMIN || !user.university) {
    redirect("/feed");
  }

  const universityId = user.university.id;

  const [clubCount, memberCount, pendingCount, eventCount] = await Promise.all([
    prisma.club.count({ where: { universityId } }),
    prisma.membership.count({
      where: { club: { universityId } },
    }),
    prisma.joinRequest.count({
      where: { club: { universityId }, status: "PENDING" },
    }),
    prisma.event.count({
      where: { club: { universityId } },
    }),
  ]);

  const recentClubs = await prisma.club.findMany({
    where: { universityId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { memberships: true } } },
  });

  const stats = [
    {
      label: "Clubs",
      value: clubCount,
      icon: Building2,
      href: "/admin/clubs",
    },
    {
      label: "Total Members",
      value: memberCount,
      icon: Users,
      href: "/admin/members",
    },
    {
      label: "Pending Requests",
      value: pendingCount,
      icon: ClipboardList,
      href: "/admin/clubs",
      highlight: pendingCount > 0,
    },
    {
      label: "Total Events",
      value: eventCount,
      icon: CalendarDays,
      href: "/admin/clubs",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {user.university.name} overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-xl p-5 
                       shadow-sm hover:shadow-md transition-shadow 
                       hover:border-[#F5A623] group space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <stat.icon
                className={`h-4 w-4 transition-colors
                  group-hover:text-[#F5A623]
                  ${stat.highlight ? "text-[#F5A623]" : "text-gray-300"}`}
              />
            </div>
            <p
              className={`text-3xl font-bold
                ${stat.highlight ? "text-[#F5A623]" : "text-gray-900"}`}
            >
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent clubs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900 font-semibold text-lg">Recent Clubs</h2>
          <Link
            href="/admin/clubs"
            className="text-[#F5A623] text-sm hover:underline"
          >
            View all →
          </Link>
        </div>
        <div
          className="bg-white border border-gray-200 rounded-xl 
                        shadow-sm overflow-hidden"
        >
          {recentClubs.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No clubs yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentClubs.map((club) => (
                <li
                  key={club.id}
                  className="flex items-center justify-between 
                             px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {club.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {club._count.memberships} member
                      {club._count.memberships !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/admin/clubs/${club.id}`}
                    className="text-[#F5A623] text-xs hover:underline"
                  >
                    Manage →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
