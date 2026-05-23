import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EUserRole } from "@/generated/prisma/enums";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditClubForm from "@/components/admin/EditClubForm";
import AssignChairForm from "@/components/admin/AssignChairForm";
import DeleteClubButton from "@/components/admin/DeleteClubButton";

export default async function AdminClubDetailPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { university: true },
  });

  if (!user || user.role !== EUserRole.ADMIN || !user.university) {
    redirect("/feed");
  }

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      _count: { select: { memberships: true, events: true } },
      memberships: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!club || club.universityId !== user.university.id) notFound();

  const chair = club.memberships.find((m) => m.role === "CHAIR") ?? null;
  const hasChair = !!chair;

  // All users for assign chair dropdown — exclude existing members
  const existingMemberIds = club.memberships.map((m) => m.userId);
  const allUsers = await prisma.user.findMany({
    where: {
      role: "USER",
      id: { notIn: existingMemberIds },
    },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  const roleBadge: Record<string, string> = {
    CHAIR: "bg-[#FFF8EC] text-[#F5A623]",
    OFFICER: "bg-blue-50 text-blue-600",
    MEMBER: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/admin/clubs"
        className="flex items-center gap-1.5 text-gray-500 
                   hover:text-[#F5A623] text-sm transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clubs
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {club._count.memberships} members · {club._count.events} events
          </p>
        </div>
        <DeleteClubButton clubId={club.id} clubName={club.name} />
      </div>

      {/* Edit club */}
      <section className="space-y-3">
        <h2 className="text-gray-900 font-semibold">Club Details</h2>
        <EditClubForm
          clubId={club.id}
          initialName={club.name}
          initialBio={club.bio ?? ""}
        />
      </section>

      {/* Assign chair */}
      {!hasChair && (
        <section className="space-y-3">
          <div>
            <h2 className="text-gray-900 font-semibold">Assign Chair</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              This club has no chair yet. Assign one to get it started.
            </p>
          </div>
          <AssignChairForm clubId={club.id} users={allUsers} />
        </section>
      )}

      {/* Members list */}
      <section className="space-y-3">
        <h2 className="text-gray-900 font-semibold">
          Members ({club.memberships.length})
        </h2>
        {club.memberships.length === 0 ? (
          <div
            className="bg-white border border-gray-200 rounded-xl p-6 
                          text-center text-gray-400 text-sm shadow-sm"
          >
            No members yet
          </div>
        ) : (
          <div
            className="bg-white border border-gray-200 rounded-xl 
                          shadow-sm overflow-hidden"
          >
            <ul className="divide-y divide-gray-100">
              {club.memberships.map((m) => (
                <li
                  key={m.userId}
                  className="flex items-center justify-between 
                             px-5 py-3"
                >
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {m.user.name}
                    </p>
                    <p className="text-gray-400 text-xs">{m.user.email}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold rounded-full 
                                px-2 py-0.5 ${roleBadge[m.role]}`}
                  >
                    {m.role.charAt(0) + m.role.slice(1).toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
