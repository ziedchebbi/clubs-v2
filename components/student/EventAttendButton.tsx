"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  joinEvent,
  leaveEvent,
} from "@/app/(student)/clubs/[clubId]/events/[eventId]/actions";
import { CheckCircle } from "lucide-react";

type Props = {
  eventId: string;
  clubId: string;
  isAttending: boolean;
};

export default function EventAttendButton({
  eventId,
  clubId,
  isAttending,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      await joinEvent(eventId, clubId);
    });
  };

  const handleLeave = () => {
    startTransition(async () => {
      await leaveEvent(eventId, clubId);
    });
  };

  if (isAttending) {
    return (
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div
          className="flex items-center gap-1.5 text-green-600 text-xs 
                        font-semibold"
        >
          <CheckCircle className="h-4 w-4" />
          You're going
        </div>
        <button
          onClick={handleLeave}
          disabled={isPending}
          className="text-gray-400 text-xs hover:text-red-400 
                     transition-colors underline underline-offset-2"
        >
          {isPending ? "Cancelling..." : "Cancel RSVP"}
        </button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleJoin}
      disabled={isPending}
      className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                 font-semibold text-sm shrink-0"
    >
      {isPending ? "Joining..." : "Attend Event"}
    </Button>
  );
}
