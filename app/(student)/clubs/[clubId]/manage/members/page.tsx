import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import MemberActions from "@/components/student/MemberActions";

export default async function ManageMembersPage({
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

  if (!membership || membership.role !== EMemberRole.CHAIR) notFound();

  const members = await prisma.membership.findMany({
    where: { clubId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 font-semibold text-lg">Members</h2>
        <span
          className="bg-gray-100 text-gray-500 text-xs font-semibold 
                         rounded-full px-2 py-0.5"
        >
          {members.length} total
        </span>
      </div>

      <div className="space-y-3">
        {members.map((m) => {
          const isCurrentUser = m.userId === userId;
          return (
            <div
              key={m.userId}
              className="bg-white border border-gray-200 rounded-xl p-4 
                         flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={m.user.image ?? undefined}
                    alt={m.user.name}
                  />
                  <AvatarFallback
                    className="bg-[#FFF8EC] text-[#F5A623] 
                                             font-semibold"
                  >
                    {m.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-medium text-sm">
                      {m.user.name}
                    </p>
                    {isCurrentUser && (
                      <span className="text-gray-400 text-xs">(you)</span>
                    )}
                    <span
                      className={`text-xs font-semibold rounded-full px-2 
                                  py-0.5 ${
                                    m.role === "CHAIR"
                                      ? "bg-[#FFF8EC] text-[#F5A623]"
                                      : m.role === "OFFICER"
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-gray-100 text-gray-500"
                                  }`}
                    >
                      {m.role.charAt(0) + m.role.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{m.user.email}</p>
                  <p className="text-gray-300 text-xs mt-0.5">
                    Joined {format(new Date(m.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              {!isCurrentUser && (
                <MemberActions
                  targetUserId={m.user.id}
                  currentRole={m.role}
                  clubId={clubId}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
