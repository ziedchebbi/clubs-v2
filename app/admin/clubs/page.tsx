import PageHeader from "@/components/admin/PageHeader";
import AddClubForm from "@/components/admin/AddClubForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

// Server Component
export default async function AdminClubsPage() {
  // Fetch all clubs with university, _count of memberships/events
  const clubs = await prisma.club.findMany({
    include: {
      university: { select: { id: true, name: true } },
      _count: { select: { memberships: true, events: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  // Fetch all universities for AddClubForm
  const universities = await prisma.university.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 sm:ml-56">
      <PageHeader title="Clubs" description="Manage university clubs" />
      <div className="flex justify-between items-center mb-6">
        <div />
        {/* AddClubForm handles its own client state (toggle/modal) */}
        <AddClubForm universities={universities} />
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#0d1b3e]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Club Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                University
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Events
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clubs.map((club) => (
              <tr key={club.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#0d1b3e]">
                  {club.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {club.university?.name || (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {club._count.memberships}
                </td>
                <td className="px-6 py-4 text-center">{club._count.events}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(club.createdAt), "yyyy-MM-dd")}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {/* Move DeleteClubButton to a client component if it uses state */}
                  {/* <DeleteClubButton clubId={club.id} clubName={club.name} /> */}
                  <Link
                    href={`/admin/memberships?clubId=${club.id}`}
                    className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#0d1b3e] rounded hover:bg-[#1a295c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d1b3e]"
                  >
                    View Members
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
