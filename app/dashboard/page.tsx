import { getSession } from "@/lib/auth";
import { SessionUser } from "@/lib/auth-types";
import Link from "next/link";
import { Users, CalendarDays, Megaphone, Eye } from "lucide-react";

type MyClub = {
  id: string;
  name: string;
  university: { name: string } | null;
  memberships: any[];
  role: 'PRESIDENT' | 'MEMBER';
};

async function getMyClubs() {
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/me/clubs`, { cache: "no-store" });
  if (!res.ok) return [];
  const { data } = await res.json();
  return data;
}

export default async function DashboardPage() {
  const session = await getSession(new Headers());
  const user = session?.user as SessionUser | undefined;
  const myClubs: MyClub[] = await getMyClubs();

  if (!user) {
    return <div className="container mx-auto p-8"><p>You must be logged in.</p></div>;
  }

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Welcome back, {user.name}!</h1>
        <p className="text-sm text-[#64748b] mt-1">Here's a summary of your club activities.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0d1b2a]">{myClubs.length}</p>
            <p className="text-sm text-[#64748b]">Your Clubs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0d1b2a]">3</p>
            <p className="text-sm text-[#64748b]">Upcoming Events</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0d1b2a]">5</p>
            <p className="text-sm text-[#64748b]">New Announcements</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#0d1b2a] mb-4">My Clubs</h2>
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0]">
          <table className="w-full">
            <thead className="bg-[#0d1b2a] text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Club Name</th>
                <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">University</th>
                <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Your Role</th>
                <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Members</th>
                <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {myClubs.map((club) => (
                <tr key={club.id} className="hover:bg-[#f8fafc]">
                  <td className="px-4 py-3 text-sm font-medium text-[#1e293b]">{club.name}</td>
                  <td className="px-4 py-3 text-sm text-[#1e293b]">{club.university?.name ?? "N/A"}</td>
                  <td className="px-4 py-3 text-sm">
                    {club.role === 'PRESIDENT' ? (
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">PRESIDENT</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">MEMBER</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1e293b]">{club.memberships.length}</td>
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
    </div>
  );
}
