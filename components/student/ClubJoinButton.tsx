"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  requestJoinClub,
  cancelJoinRequest,
  leaveClub,
} from "@/app/(student)/clubs/actions";

type Props = {
  clubId: string;
  isMember: boolean;
  isChair: boolean;
  hasPendingRequest: boolean;
};

export default function ClubJoinButton({
  clubId,
  isMember,
  isChair,
  hasPendingRequest,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleRequest = () => {
    startTransition(async () => {
      await requestJoinClub(clubId);
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      await cancelJoinRequest(clubId);
    });
  };

  const handleLeave = () => {
    startTransition(async () => {
      await leaveClub(clubId);
    });
  };

  if (isChair) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-gray-200 text-gray-400 text-xs cursor-not-allowed"
        title="Transfer chair role before leaving"
      >
        Chair — cannot leave
      </Button>
    );
  }

  if (isMember) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLeave}
        disabled={isPending}
        className="border-red-200 text-red-400 hover:bg-red-50 
                   hover:text-red-500 text-xs"
      >
        {isPending ? "Leaving..." : "Leave Club"}
      </Button>
    );
  }

  if (hasPendingRequest) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={isPending}
        className="border-gray-300 text-gray-400 hover:border-red-300 
                   hover:text-red-400 text-xs"
      >
        {isPending ? "Cancelling..." : "Request Pending — Cancel"}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleRequest}
      disabled={isPending}
      className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                 text-xs font-semibold"
    >
      {isPending ? "Requesting..." : "Request to Join"}
    </Button>
  );
}
