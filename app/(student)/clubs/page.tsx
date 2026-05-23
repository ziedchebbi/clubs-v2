import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClubsGrid from "@/components/student/ClubsGrid";

export default async function ClubsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const [clubs, memberships, joinRequests] = await Promise.all([
    prisma.club.findMany({
      include: {
        _count: { select: { memberships: true } },
        university: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.membership.findMany({
      where: { userId },
      select: { clubId: true, role: true },
    }),
    prisma.joinRequest.findMany({
      where: { userId, status: "PENDING" },
      select: { clubId: true },
    }),
  ]);

  const joinedClubIds = new Set(memberships.map((m) => m.clubId));
  const pendingClubIds = new Set(joinRequests.map((r) => r.clubId));

  const serializedClubs = clubs.map((club) => ({
    id: club.id,
    name: club.name,
    bio: club.bio,
    universityName: club.university?.name ?? null,
    memberCount: club._count.memberships,
    isJoined: joinedClubIds.has(club.id),
    hasPendingRequest: pendingClubIds.has(club.id),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clubs</h1>
        <p className="text-gray-500 text-sm mt-1">
          Find and join clubs at your university
        </p>
      </div>
      <ClubsGrid clubs={serializedClubs} />
    </div>
  );
}
