"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  approveRequest,
  rejectRequest,
} from "@/app/(student)/clubs/[clubId]/manage/requests/actions";

type Props = {
  requestId: string;
  userId: string;
  clubId: string;
};

export default function RequestActions({ requestId, userId, clubId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await approveRequest(requestId, userId, clubId);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await rejectRequest(requestId, clubId);
    });
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={isPending}
        className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                   font-semibold text-xs"
      >
        {isPending ? "..." : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleReject}
        disabled={isPending}
        className="border-red-200 text-red-400 hover:bg-red-50 
                   hover:text-red-500 text-xs"
      >
        {isPending ? "..." : "Reject"}
      </Button>
    </div>
  );
}
