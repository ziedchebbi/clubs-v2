import Link from "next/link";
import { Eye, Search } from "lucide-react";

type Club = {
  id: string;
  name: string;
  university: { name: string } | null;
  memberships: any[];
  events: any[];
  createdAt: string;
};

async function getClubs(searchQuery?: string) {
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/clubs`, { cache: "no-store" });
  if (!res.ok) return [];
  const { data } = await res.json();
  if (!searchQuery) return data;
  return data.filter((club: Club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const clubs: Club[] = await getClubs(searchParams.search);

  return (
    <div className="container mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Clubs</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Browse and discover clubs across all universities.
        </p>
      </header>
      <div className="border-b border-[#e2e8f0] mb-6"></div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
        <input
          type="search"
          name="search"
          placeholder="Search for a club..."
          defaultValue={searchParams.search}
          className="w-full border border-[#e2e8f0] rounded-lg pl-10 pr-3 py-2 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0]">
        <table className="w-full">
          <thead className="bg-[#0d1b2a] text-white">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Club Name</th>
              <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">University</th>
              <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Members</th>
              <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Events</th>
              <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Created</th>
              <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {clubs.map((club) => (
              <tr key={club.id} className="hover:bg-[#f8fafc]">
                <td className="px-4 py-3 text-sm font-medium text-[#1e293b]">{club.name}</td>
                <td className="px-4 py-3 text-sm text-[#1e293b]">{club.university?.name ?? "N/A"}</td>
                <td className="px-4 py-3 text-sm text-[#1e293b]">{club.memberships.length}</td>
                <td className="px-4 py-3 text-sm text-[#1e293b]">{club.events.length}</td>
                <td className="px-4 py-3 text-sm text-[#1e293b]">{new Date(club.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/clubs/${club.id}`} className="bg-[#0d1b2a] hover:bg-[#1e3a5f] text-white text-sm rounded-lg px-3 py-1.5 inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> View
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
