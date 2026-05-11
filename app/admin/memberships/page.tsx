import MembershipsTable from "@/components/admin/MembershipsTable";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminMembershipsPage({
  searchParams,
}: {
  searchParams?: { clubId?: string };
}) {
  const initialClubId = searchParams?.clubId || "";
  // Fetch all memberships with user and club info
  const memberships = await prisma.membership.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      club: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  // Fetch all clubs for filter dropdown
  const clubs = await prisma.club.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return (
    <div>
      <PageHeader
        title="Memberships"
        description="Assign club roles and manage membership"
      />
      <MembershipsTable
        memberships={memberships}
        clubs={clubs}
        initialClubId={initialClubId}
      />
    </div>
  );
}
