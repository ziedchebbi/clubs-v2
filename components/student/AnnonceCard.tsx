"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type AnnonceCardProps = {
  item: {
    id: string;
    content: string;
    createdAt: string;
    author: { name: string; image: string | null };
    club: { id: string; name: string };
    _count: { comments: number };
  };
};

export default function AnnonceCard({ item }: AnnonceCardProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(
      formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
    );
  }, [item.createdAt]);

  const isTruncated = item.content.length > 200;

  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={item.author.image ?? undefined}
              alt={item.author.name}
            />
            <AvatarFallback className="bg-[#FFF8EC] text-[#F5A623] font-semibold">
              {item.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-gray-900 font-semibold text-sm">
              {item.author.name}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-400">in</span>
              <Link
                href={`/clubs/${item.club.id}`}
                className="text-[#F5A623] hover:underline font-medium"
              >
                {item.club.name}
              </Link>
              <span className="text-gray-400">·</span>
              {timeAgo && <time className="text-gray-400">{timeAgo}</time>}
            </div>
          </div>
        </div>
        <span className="bg-[#FFF8EC] text-[#F5A623] text-xs font-semibold rounded-full px-2 py-0.5 whitespace-nowrap border border-[#F5A623]/20">
          Announcement
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {isTruncated ? (
          <>
            {item.content.slice(0, 200)}
            {"... "}
            <Link
              href={`/clubs/${item.club.id}/announcements/${item.id}`}
              className="text-[#F5A623] text-xs hover:underline font-medium"
            >
              Read more
            </Link>
          </>
        ) : (
          item.content
        )}
      </p>

      {/* Footer */}
      <Link
        href={`/clubs/${item.club.id}/announcements/${item.id}`}
        className="flex items-center gap-1 text-gray-400 text-xs hover:text-[#F5A623] transition-colors w-fit mt-1"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        <span>
          {item._count.comments} comment
          {item._count.comments !== 1 ? "s" : ""}
        </span>
      </Link>
    </article>
  );
}
