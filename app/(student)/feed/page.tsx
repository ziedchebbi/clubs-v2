import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FeedTabs from "@/components/student/FeedTabs";
import { format } from "date-fns";

export default async function FeedPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Step 1 — get memberships
  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: {
      clubId: true,
      role: true,
      club: { select: { id: true, name: true } },
    },
  });

  const memberClubIds = memberships.map((m) => m.clubId);

  // Step 2 — fetch in parallel, default to [] if no clubs
  const [recentAnnonces, recentEvents, upcomingEvents] = await Promise.all([
    memberClubIds.length > 0
      ? prisma.annonce.findMany({
          where: {
            clubId: { in: memberClubIds },
            status: "PUBLISHED",
          },
          include: {
            author: { select: { name: true, image: true } },
            club: { select: { id: true, name: true } },
            _count: { select: { comments: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 30,
        })
      : Promise.resolve([]),

    memberClubIds.length > 0
      ? prisma.event.findMany({
          where: { clubId: { in: memberClubIds } },
          include: {
            club: { select: { id: true, name: true } },
            organizer: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 30,
        })
      : Promise.resolve([]),

    memberClubIds.length > 0
      ? prisma.event.findMany({
          where: {
            clubId: { in: memberClubIds },
            startsAt: { gte: new Date() },
          },
          include: { club: { select: { id: true, name: true } } },
          orderBy: { startsAt: "asc" },
          take: 3,
        })
      : Promise.resolve([]),
  ]);

  // Step 3 — merge and sort
  const feedItems = [
    ...recentAnnonces.map((a) => ({
      type: "annonce" as const,
      data: {
        ...a,
        createdAt: a.createdAt.toISOString(),
      },
      createdAt: a.createdAt.toISOString(),
    })),
    ...recentEvents.map((e) => ({
      type: "event" as const,
      data: {
        ...e,
        startsAt: e.startsAt?.toISOString() ?? null,
        createdAt: e.createdAt.toISOString(),
      },
      createdAt: e.createdAt.toISOString(),
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
        <p className="text-gray-500 text-sm mt-1">
          Everything happening in your clubs
        </p>
      </div>

      {/* Empty state — no memberships */}
      {memberships.length === 0 ? (
        <div className="max-w-md mx-auto mt-12 bg-white border border-gray-200 border-l-4 border-l-[#F5A623] rounded-xl p-8 text-center shadow-sm">
          <h2 className="text-gray-900 font-bold text-xl">
            Welcome to UniClubs 👋
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Join clubs to see their events and announcements here.
          </p>
          <Button
            asChild
            className="mt-4 bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] font-semibold"
          >
            <Link href="/clubs">Browse Clubs</Link>
          </Button>
        </div>
      ) : (
        /* Three column layout */
        <div className="xl:grid xl:grid-cols-[220px_1fr_220px] gap-8 items-start">
          {/* LEFT — Your Clubs widget */}
          <aside
            className="hidden xl:block bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-6"
            aria-label="Your clubs"
          >
            <h2 className="text-gray-900 font-semibold text-sm mb-3">
              Your Clubs
            </h2>
            <ul className="space-y-2">
              {memberships.map((m) => (
                <li
                  key={m.clubId}
                  className="flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/clubs/${m.clubId}`}
                    className="text-gray-700 text-sm hover:text-[#F5A623] transition-colors truncate font-medium"
                  >
                    {m.club.name}
                  </Link>
                  <span
                    className={`text-xs font-semibold rounded-full px-2 py-0.5 whitespace-nowrap ${
                      m.role === "CHAIR"
                        ? "bg-[#FFF8EC] text-[#F5A623]"
                        : m.role === "OFFICER"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {m.role.charAt(0) + m.role.slice(1).toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/clubs"
              className="text-[#F5A623] text-xs font-medium hover:underline mt-4 block"
            >
              Browse more →
            </Link>
          </aside>

          {/* CENTER — Feed */}
          <div className="min-w-0">
            <FeedTabs items={feedItems} />
          </div>

          {/* RIGHT — Upcoming Events widget */}
          <aside
            className="hidden xl:block bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-6"
            aria-label="Upcoming events"
          >
            <h2 className="text-gray-900 font-semibold text-sm mb-3">
              Upcoming
            </h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-400 text-xs">No upcoming events</p>
            ) : (
              <ul className="space-y-1">
                {upcomingEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex gap-2 items-start py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="bg-[#FFF8EC] text-[#F5A623] rounded-lg px-2 py-1 text-center min-w-[40px]">
                      <p className="font-bold text-sm leading-none">
                        {event.startsAt
                          ? format(new Date(event.startsAt), "d")
                          : "—"}
                      </p>
                      <p className="text-[10px] uppercase leading-none mt-0.5">
                        {event.startsAt
                          ? format(new Date(event.startsAt), "MMM")
                          : ""}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-800 text-xs font-medium leading-snug truncate">
                        {event.title}
                      </p>
                      {event.club && (
                        <p className="text-gray-400 text-[10px] mt-0.5 truncate">
                          {event.club.name}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
