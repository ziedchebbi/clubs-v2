"use client";
import { useTransition } from "react";
import Link from "next/link";
import { Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { leaveClub } from "@/app/(student)/clubs/actions";

type Props = {
  membership: {
    role: string;
    clubId: string;
    clubName: string;
    clubBio: string | null;
    memberCount: number;
    eventCount: number;
  };
};

const roleBadge: Record<string, string> = {
  CHAIR: "bg-[#FFF8EC] text-[#F5A623] border border-[#F5A623]/20",
  OFFICER: "bg-blue-50 text-blue-600 border border-blue-100",
  MEMBER: "bg-gray-100 text-gray-500 border border-gray-200",
};

const roleLabel: Record<string, string> = {
  CHAIR: "Chair",
  OFFICER: "Officer",
  MEMBER: "Member",
};

export default function MyClubCard({ membership }: Props) {
  const [isPending, startTransition] = useTransition();
  const isChair = membership.role === "CHAIR";

  const handleLeave = () => {
    startTransition(async () => {
      await leaveClub(membership.clubId);
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 border-l-4 
                    border-l-[#F5A623] rounded-xl p-5 space-y-4 shadow-sm"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <Link
            href={`/clubs/${membership.clubId}`}
            className="text-gray-900 font-bold text-lg hover:text-[#F5A623] 
                       transition-colors truncate block"
          >
            {membership.clubName}
          </Link>
          {membership.clubBio && (
            <p className="text-gray-500 text-sm line-clamp-2">
              {membership.clubBio}
            </p>
          )}
        </div>
        <span
          className={`text-xs font-semibold rounded-full px-2 py-0.5 
                      whitespace-nowrap shrink-0 ${roleBadge[membership.role]}`}
        >
          {roleLabel[membership.role]}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-gray-400 text-xs">
          <Users className="h-3.5 w-3.5" />
          {membership.memberCount} member
          {membership.memberCount !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1 text-gray-400 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          {membership.eventCount} event
          {membership.eventCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-[#F5A623] text-[#F5A623] hover:bg-[#FFF8EC] 
                     text-xs flex-1"
        >
          <Link href={`/clubs/${membership.clubId}`}>View Club</Link>
        </Button>

        {isChair ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-gray-300 text-xs w-full cursor-not-allowed"
                  >
                    Leave
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transfer chair role before leaving</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeave}
            disabled={isPending}
            className="text-red-400 hover:text-red-500 hover:bg-red-50 
                       text-xs flex-1"
          >
            {isPending ? "Leaving..." : "Leave"}
          </Button>
        )}
      </div>
    </div>
  );
}
