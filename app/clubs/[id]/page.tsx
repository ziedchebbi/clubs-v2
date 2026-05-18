import { getSession } from "@/lib/auth";
import { SessionUser } from "@/lib/auth-types";
import Link from "next/link";
import { Users, CalendarDays, Megaphone, Plus, Pencil } from "lucide-react";
import JoinButton from "@/components/clubs/join-button";

type ClubDetails = {
  id: string;
  name: string;
  bio: string | null;
  university: { name: string } | null;
  createdAt: string;
  memberships: { userId: string; role: "PRESIDENT" | "MEMBER"; user: { name: string | null; email: string; } }[];
  events: { id: string; title: string; startsAt: string | null; isPublic: boolean }[];
  annonces: { id: string; content: string; createdAt: string; author: { name: string | null; }; _count: { commentaires: number } }[];
};

async function getClubDetails(id: string): Promise<ClubDetails | null> {
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/clubs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export default async function ClubDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const club = await getClubDetails(params.id);
  const session = await getSession(new Headers());
  const user = session?.user as SessionUser | undefined;

  if (!club) {
    return <div className="container mx-auto p-8"><p>Club not found.</p></div>;
  }

  const userMembership = user ? club.memberships.find((m) => m.userId === user.id) : null;
  const userRole = userMembership?.role ?? null;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#0d1b2a]">{club.name}</h1>
            <p className="text-sm text-[#64748b] mt-1">{club.university?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {userRole === "PRESIDENT" && (
              <Link href={`/clubs/${club.id}/edit`} className="border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2">
                <Pencil className="h-4 w-4" /> Edit
              </Link>
            )}
            <JoinButton clubId={club.id} userRole={userRole} />
          </div>
        </div>
        <p className="mt-4 text-sm text-[#1e293b]">{club.bio}</p>
        <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-[#64748b]">
            <Users className="h-4 w-4" />
            <span>{club.memberships.length} members</span>
          </div>
          <div className="flex items-center gap-2 text-[#64748b]">
            <CalendarDays className="h-4 w-4" />
            <span>{club.events.length} events</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div id="events">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0d1b2a] flex items-center gap-2">
              <CalendarDays className="h-5 w-5" /> Events
            </h2>
            {userRole === 'PRESIDENT' && (
              <Link href={`/clubs/${club.id}/events/new`} className="bg-[#0d1b2a] hover:bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Event
              </Link>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0]">
            <table className="w-full"></table>
          </div>
        </div>

        {userRole && (
          <div id="annonces">
            <h2 className="text-xl font-bold text-[#0d1b2a] flex items-center gap-2 mb-4">
              <Megaphone className="h-5 w-5" /> Announcements
            </h2>
          </div>
        )}

        <div id="members">
          <h2 className="text-xl font-bold text-[#0d1b2a] flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" /> Members
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0]">
            <table className="w-full"></table>
          </div>
        </div>
      </div>
    </div>
  );
}
