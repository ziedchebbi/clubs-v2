import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMemberRole } from "@/generated/prisma/enums";
import ClubEventCard from "@/components/student/ClubEventCard";
import ClubAnnonceCard from "@/components/student/ClubAnnonceCard";
import ClubJoinButton from "@/components/student/ClubJoinButton";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const [club, joinRequest] = await Promise.all([
    prisma.club.findUnique({
      where: { id: clubId },
      include: {
        university: { select: { name: true } },
        _count: { select: { memberships: true, events: true } },
        memberships: { where: { userId }, take: 1 },
        events: {
          where: { startsAt: { gte: new Date() } },
          orderBy: { startsAt: "asc" },
          take: 5,
          include: {
            organizer: { select: { name: true, image: true } },
          },
        },
        annonces: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            author: { select: { name: true, image: true } },
            _count: { select: { comments: true } },
          },
        },
      },
    }),
    prisma.joinRequest.findUnique({
      where: { userId_clubId: { userId, clubId } },
      select: { status: true },
    }),
  ]);

  if (!club) notFound();

  const userMembership = club.memberships[0] ?? null;
  const isMember = !!userMembership;
  const isOfficerOrAbove =
    userMembership?.role === EMemberRole.OFFICER ||
    userMembership?.role === EMemberRole.CHAIR;
  const hasPendingRequest = joinRequest?.status === "PENDING";

  const serializedEvents = club.events.map((e) => ({
    id: e.id,
    title: e.title,
    content: e.content,
    startsAt: e.startsAt?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    organizer: e.organizer,
    clubId: club.id,
  }));

  const serializedAnnonces = club.annonces.map((a) => ({
    id: a.id,
    content: a.content,
    createdAt: a.createdAt.toISOString(),
    author: a.author,
    club: { id: club.id, name: club.name },
    _count: a._count,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        href="/clubs"
        className="flex items-center gap-1.5 text-gray-500 
                   hover:text-[#F5A623] text-sm transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clubs
      </Link>

      <div
        className="bg-white border border-gray-200 border-l-4 
                      border-l-[#F5A623] rounded-xl p-6 space-y-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
            {club.university && (
              <p className="text-gray-400 text-sm">{club.university.name}</p>
            )}
            {club.bio && (
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {club.bio}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <ClubJoinButton
              clubId={club.id}
              isMember={isMember}
              isChair={userMembership?.role === EMemberRole.CHAIR}
              hasPendingRequest={hasPendingRequest}
            />
            {isOfficerOrAbove && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#F5A623] text-[#F5A623] 
                           hover:bg-[#FFF8EC] text-xs"
              >
                <Link href={`/clubs/${club.id}/manage`}>Manage Club</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <span
            className="flex items-center gap-1.5 bg-[#FFF8EC] 
                           text-[#F5A623] text-xs font-semibold 
                           rounded-full px-3 py-1"
          >
            <Users className="h-3 w-3" />
            {club._count.memberships} member
            {club._count.memberships !== 1 ? "s" : ""}
          </span>
          <span
            className="bg-gray-100 text-gray-500 text-xs font-semibold 
                           rounded-full px-3 py-1"
          >
            {club._count.events} event
            {club._count.events !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-gray-900 font-semibold text-lg">
            Upcoming Events
          </h2>
          {serializedEvents.length === 0 ? (
            <div
              className="bg-white border border-gray-200 rounded-xl p-6 
                            text-center text-gray-400 text-sm"
            >
              No upcoming events
            </div>
          ) : (
            <div className="space-y-3">
              {serializedEvents.map((event) => (
                <ClubEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-gray-900 font-semibold text-lg">Announcements</h2>
          {serializedAnnonces.length === 0 ? (
            <div
              className="bg-white border border-gray-200 rounded-xl p-6 
                            text-center text-gray-400 text-sm"
            >
              No announcements yet
            </div>
          ) : (
            <div className="space-y-3">
              {serializedAnnonces.map((annonce) => (
                <ClubAnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
