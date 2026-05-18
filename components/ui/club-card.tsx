import Link from "next/link";
import { Users, Building2 } from "lucide-react";

type ClubCardProps = {
  id: string;
  name: string;
  bio: string | null;
  university: { name: string } | null;
  memberCount: number;
  userRole?: 'PRESIDENT' | 'MEMBER';
};

export default function ClubCard({ id, name, bio, university, memberCount }: ClubCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col">
      <div className="flex-grow">
        <h3 className="font-bold text-[#0d1b2a]">{name}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-[#64748b]">
          <Building2 className="h-3 w-3" />
          <span>{university?.name ?? 'No University'}</span>
        </div>
        <p className="mt-3 text-sm text-[#64748b] line-clamp-2 h-10">{bio}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <Users className="h-4 w-4" />
          <span>{memberCount} members</span>
        </div>
        <Link href={`/clubs/${id}`} className="bg-amber-500 hover:bg-amber-600 text-[#0d1b2a] font-semibold px-3 py-1.5 rounded-lg text-sm">
          View
        </Link>
      </div>
    </div>
  );
}
