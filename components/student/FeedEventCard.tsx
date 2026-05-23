"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, ChevronRight } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

type FeedEventCardProps = {
  item: {
    id: string;
    title: string;
    content: string | null;
    startsAt: string | null;
    createdAt: string;
    organizer: { name: string; image: string | null };
    club: { id: string; name: string } | null;
  };
};

export default function FeedEventCard({ item }: FeedEventCardProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(
      formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
    );
  }, [item.createdAt]);

  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={item.organizer.image ?? undefined}
              alt={item.organizer.name}
            />
            <AvatarFallback className="bg-[#FFF8EC] text-[#F5A623] font-semibold">
              {item.organizer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-gray-900 font-semibold text-sm">
              {item.organizer.name}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-400">posted an event</span>
              {item.club && (
                <>
                  <span className="text-gray-400">in</span>
                  <Link
                    href={`/clubs/${item.club.id}`}
                    className="text-[#F5A623] hover:underline font-medium"
                  >
                    {item.club.name}
                  </Link>
                </>
              )}
              <span className="text-gray-400">·</span>
              {timeAgo && <time className="text-gray-400">{timeAgo}</time>}
            </div>
          </div>
        </div>
        <span className="bg-blue-50 text-blue-600 text-xs font-semibold rounded-full px-2 py-0.5 whitespace-nowrap border border-blue-100">
          Event
        </span>
      </div>

      {/* Content Box */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100">
        <p className="text-gray-900 font-bold text-sm">{item.title}</p>
        {item.startsAt && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#F5A623]" />
            <time className="text-[#F5A623] text-sm font-medium">
              {format(new Date(item.startsAt), "EEE, MMM d · h:mm a")}
            </time>
          </div>
        )}
        {item.content && (
          <p className="text-gray-500 text-xs line-clamp-2">{item.content}</p>
        )}
      </div>

      {/* Footer */}
      {item.club && (
        <Link
          href={`/clubs/${item.club.id}/events/${item.id}`}
          className="flex items-center gap-1 text-[#F5A623] text-sm font-semibold hover:underline w-fit"
        >
          View Event
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </article>
  );
}
