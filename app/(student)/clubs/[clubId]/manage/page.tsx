import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import Link from "next/link";
import { Users, CalendarPlus, Megaphone, ClipboardList } from "lucide-react";

export default async function ManageOverviewPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const membership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId, clubId } },
  });

  if (
    !membership ||
    (membership.role !== EMemberRole.OFFICER &&
      membership.role !== EMemberRole.CHAIR)
  ) {
    notFound();
  }

  const [memberCount, pendingCount, eventCount, annonceCount] =
    await Promise.all([
      prisma.membership.count({ where: { clubId } }),
      prisma.joinRequest.count({ where: { clubId, status: "PENDING" } }),
      prisma.event.count({ where: { clubId } }),
      prisma.annonce.count({ where: { clubId, status: "PUBLISHED" } }),
    ]);

  const stats = [
    {
      label: "Members",
      value: memberCount,
      icon: Users,
      href: `/clubs/${clubId}/manage/members`,
    },
    {
      label: "Pending Requests",
      value: pendingCount,
      icon: ClipboardList,
      href: `/clubs/${clubId}/manage/requests`,
      highlight: pendingCount > 0,
    },
    {
      label: "Events",
      value: eventCount,
      icon: CalendarPlus,
      href: `/clubs/${clubId}/manage/events`,
    },
    {
      label: "Announcements",
      value: annonceCount,
      icon: Megaphone,
      href: `/clubs/${clubId}/manage/announcements`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="bg-white border border-gray-200 rounded-xl p-5 
                     shadow-sm hover:shadow-md transition-shadow space-y-3
                     hover:border-[#F5A623] group"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <stat.icon
              className={`h-4 w-4 ${
                stat.highlight ? "text-[#F5A623]" : "text-gray-300"
              } group-hover:text-[#F5A623] transition-colors`}
            />
          </div>
          <p
            className={`text-3xl font-bold ${
              stat.highlight ? "text-[#F5A623]" : "text-gray-900"
            }`}
          >
            {stat.value}
          </p>
        </Link>
      ))}
    </div>
  );
}
