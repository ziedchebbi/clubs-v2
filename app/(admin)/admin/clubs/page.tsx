import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EUserRole } from "@/generated/prisma/enums";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";

export default async function AdminClubsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { university: true },
  });

  if (!user || user.role !== EUserRole.ADMIN || !user.university) {
    redirect("/feed");
  }

  const clubs = await prisma.club.findMany({
    where: { universityId: user.university.id },
    include: {
      _count: { select: { memberships: true, events: true } },
      memberships: {
        where: { role: "CHAIR" },
        include: { user: { select: { name: true } } },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clubs</h1>
          <p className="text-gray-500 text-sm mt-1">{user.university.name}</p>
        </div>
        <Button
          asChild
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold"
          size="sm"
        >
          <Link href="/admin/clubs/new">
            <Plus className="h-4 w-4 mr-1" />
            New Club
          </Link>
        </Button>
      </div>

      {clubs.length === 0 ? (
        <div
          className="bg-white border border-gray-200 rounded-xl p-10 
                        text-center space-y-3 shadow-sm"
        >
          <Building2 className="h-10 w-10 text-gray-300 mx-auto" />
          <p className="text-gray-900 font-semibold">No clubs yet</p>
          <p className="text-gray-400 text-sm">
            Create the first club for your university
          </p>
          <Button
            asChild
            className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                       font-semibold mt-2"
          >
            <Link href="/admin/clubs/new">Create Club</Link>
          </Button>
        </div>
      ) : (
        <div
          className="bg-white border border-gray-200 rounded-xl 
                        shadow-sm overflow-hidden"
        >
          <ul className="divide-y divide-gray-100">
            {clubs.map((club) => {
              const chair = club.memberships[0]?.user ?? null;
              return (
                <li
                  key={club.id}
                  className="flex items-center justify-between 
                             px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-gray-900 font-medium text-sm">
                      {club.name}
                    </p>
                    <div
                      className="flex items-center gap-3 text-xs 
                                    text-gray-400"
                    >
                      <span>
                        {club._count.memberships} member
                        {club._count.memberships !== 1 ? "s" : ""}
                      </span>
                      <span>·</span>
                      <span>
                        {club._count.events} event
                        {club._count.events !== 1 ? "s" : ""}
                      </span>
                      <span>·</span>
                      {chair ? (
                        <span className="text-[#F5A623] font-medium">
                          Chair: {chair.name}
                        </span>
                      ) : (
                        <span className="text-red-400 font-medium">
                          No chair assigned
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/admin/clubs/${club.id}`}
                    className="text-[#F5A623] text-xs hover:underline 
                               shrink-0 ml-4"
                  >
                    Manage →
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
