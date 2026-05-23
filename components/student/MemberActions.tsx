"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  promoteMember,
  demoteMember,
  removeMember,
  transferChair,
} from "@/app/(student)/clubs/[clubId]/manage/members/actions";

type Props = {
  targetUserId: string;
  currentRole: string;
  clubId: string;
};

export default function MemberActions({
  targetUserId,
  currentRole,
  clubId,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handle = (
    fn: (
      uid: string,
      cid: string,
    ) => Promise<{ success?: boolean; error?: string }>,
  ) => {
    startTransition(async () => {
      await fn(targetUserId, clubId);
    });
  };

  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
      {currentRole === "MEMBER" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => handle(promoteMember)}
          className="border-blue-200 text-blue-500 hover:bg-blue-50 text-xs"
        >
          Promote to Officer
        </Button>
      )}
      {currentRole === "OFFICER" && (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => handle(demoteMember)}
            className="border-gray-200 text-gray-500 hover:bg-gray-50 text-xs"
          >
            Demote to Member
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => handle(transferChair)}
            className="border-[#F5A623] text-[#F5A623] hover:bg-[#FFF8EC] 
                       text-xs"
          >
            Make Chair
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => handle(removeMember)}
        className="border-red-200 text-red-400 hover:bg-red-50 
                   hover:text-red-500 text-xs"
      >
        Remove
      </Button>
    </div>
  );
}
