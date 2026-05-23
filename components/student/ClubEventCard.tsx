"use client";
import Link from "next/link";
import { format } from "date-fns";
import { Clock } from "lucide-react";

type Props = {
  event: {
    id: string;
    title: string;
    content: string | null;
    startsAt: string | null;
    organizer: { name: string; image: string | null };
    clubId: string;
  };
};

export default function ClubEventCard({ event }: Props) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 
                    flex gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Date block */}
      {event.startsAt ? (
        <div
          className="bg-[#FFF8EC] text-[#F5A623] rounded-lg px-3 py-2 
                        text-center min-w-[48px] shrink-0"
        >
          <p className="font-bold text-xl leading-none">
            {format(new Date(event.startsAt), "d")}
          </p>
          <p className="text-[10px] uppercase leading-none mt-1">
            {format(new Date(event.startsAt), "MMM")}
          </p>
        </div>
      ) : (
        <div
          className="bg-gray-100 text-gray-400 rounded-lg px-3 py-2 
                        text-center min-w-[48px] shrink-0"
        >
          <p className="text-[10px] uppercase">TBD</p>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-gray-900 font-semibold text-sm truncate">
          {event.title}
        </p>
        {event.startsAt && (
          <p className="flex items-center gap-1 text-[#F5A623] text-xs">
            <Clock className="h-3 w-3" />
            {format(new Date(event.startsAt), "h:mm a")}
          </p>
        )}
        {event.content && (
          <p className="text-gray-400 text-xs line-clamp-2">{event.content}</p>
        )}
        <Link
          href={`/clubs/${event.clubId}/events/${event.id}`}
          className="text-[#F5A623] text-xs font-medium hover:underline"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
