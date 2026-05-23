"use client";
import { useTransition } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  requestJoinClub,
  cancelJoinRequest,
} from "@/app/(student)/clubs/actions";

type ClubCardProps = {
  club: {
    id: string;
    name: string;
    bio: string | null;
    universityName: string | null;
    memberCount: number;
    isJoined: boolean;
    hasPendingRequest: boolean;
  };
};

export default function ClubCard({ club }: ClubCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleRequest = () => {
    startTransition(async () => {
      await requestJoinClub(club.id);
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      await cancelJoinRequest(club.id);
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 border-l-4 
                    border-l-[#F5A623] rounded-xl p-5 
                    hover:shadow-md transition-shadow space-y-3"
    >
      <div>
        <Link
          href={`/clubs/${club.id}`}
          className="text-gray-900 font-bold text-lg hover:text-[#F5A623] 
                     transition-colors"
        >
          {club.name}
        </Link>
        {club.universityName && (
          <p className="text-gray-400 text-xs mt-0.5">{club.universityName}</p>
        )}
        {club.bio && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{club.bio}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span
          className="flex items-center gap-1 bg-[#FFF8EC] text-[#F5A623] 
                         text-xs font-semibold rounded-full px-2 py-0.5"
        >
          <Users className="h-3 w-3" />
          {club.memberCount} member{club.memberCount !== 1 ? "s" : ""}
        </span>

        {club.isJoined ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-[#F5A623] text-[#F5A623] text-xs"
          >
            Joined ✓
          </Button>
        ) : club.hasPendingRequest ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isPending}
            className="border-gray-300 text-gray-400 hover:border-red-300 
                       hover:text-red-400 text-xs"
          >
            {isPending ? "Cancelling..." : "Pending — Cancel"}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleRequest}
            disabled={isPending}
            className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                       text-xs font-semibold"
          >
            {isPending ? "Requesting..." : "Request to Join"}
          </Button>
        )}
      </div>
    </div>
  );
}
