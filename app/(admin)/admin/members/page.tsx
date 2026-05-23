import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EUserRole } from "@/generated/prisma/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminMembersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { university: true },
  });

  if (!user || user.role !== EUserRole.ADMIN || !user.university) {
    redirect("/feed");
  }

  // Get distinct users who are members of any club in this university
  const memberships = await prisma.membership.findMany({
    where: { club: { universityId: user.university.id } },
    select: { userId: true },
    distinct: ["userId"],
  });

  const userIds = memberships.map((m) => m.userId);

  const students = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          memberships: {
            where: { club: { universityId: user.university.id } },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-500 text-sm mt-1">
          {students.length} student{students.length !== 1 ? "s" : ""} across{" "}
          {user.university.name}
        </p>
      </div>

      <div
        className="bg-white border border-gray-200 rounded-xl 
                      shadow-sm overflow-hidden"
      >
        {students.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No students yet
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {students.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between px-5 py-3 
                           hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={s.image ?? undefined} alt={s.name} />
                    <AvatarFallback
                      className="bg-[#FFF8EC] text-[#F5A623] 
                                               text-xs font-semibold"
                    >
                      {s.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {s.name}
                    </p>
                    <p className="text-gray-400 text-xs">{s.email}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs shrink-0">
                  {s._count.memberships} club
                  {s._count.memberships !== 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
