import StudentsTable from "@/components/admin/StudentsTable";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminStudentsPage() {
  // TODO: Replace with real session user id
  const currentUserId = "";
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      emailVerified: true,
      _count: { select: { memberships: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <PageHeader title="Students" description="Manage registered users" />
      <StudentsTable users={users} currentUserId={currentUserId} />
    </div>
  );
}
