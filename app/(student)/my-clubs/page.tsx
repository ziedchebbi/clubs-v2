import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMemberRole } from "@/generated/prisma/enums";
import MyClubCard from "@/components/student/MyClubCard";

export default async function MyClubsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: {
      club: {
        include: {
          _count: { select: { memberships: true, events: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = memberships.map((m) => ({
    role: m.role,
    clubId: m.club.id,
    clubName: m.club.name,
    clubBio: m.club.bio,
    memberCount: m.club._count.memberships,
    eventCount: m.club._count.events,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Clubs</h1>
        <p className="text-gray-500 text-sm mt-1">Clubs you are part of</p>
      </div>

      {memberships.length === 0 ? (
        <div
          className="bg-white border border-gray-200 rounded-xl p-10 
                        text-center space-y-3 shadow-sm max-w-md mx-auto"
        >
          <Users className="h-10 w-10 text-gray-300 mx-auto" />
          <p className="text-gray-900 font-semibold">
            You haven't joined any clubs yet
          </p>
          <p className="text-gray-400 text-sm">
            Discover clubs and become part of something.
          </p>
          <Button
            asChild
            className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                       font-semibold mt-2"
          >
            <Link href="/clubs">Browse Clubs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {serialized.map((m) => (
            <MyClubCard key={m.clubId} membership={m} />
          ))}
        </div>
      )}
    </div>
  );
}
