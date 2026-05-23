"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Props = {
  annonce: {
    id: string;
    content: string;
    createdAt: string;
    author: { name: string; image: string | null };
    club: { id: string; name: string };
    _count: { comments: number };
  };
};

export default function ClubAnnonceCard({ annonce }: Props) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(
      formatDistanceToNow(new Date(annonce.createdAt), { addSuffix: true }),
    );
  }, [annonce.createdAt]);

  const isTruncated = annonce.content.length > 150;

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 
                    space-y-2 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Author row */}
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage
            src={annonce.author.image ?? undefined}
            alt={annonce.author.name}
          />
          <AvatarFallback
            className="bg-[#FFF8EC] text-[#F5A623] 
                                     text-xs font-semibold"
          >
            {annonce.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-900 font-medium">
            {annonce.author.name}
          </span>
          {timeAgo && (
            <>
              <span className="text-gray-300">·</span>
              <time className="text-gray-400">{timeAgo}</time>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {isTruncated ? (
          <>
            {annonce.content.slice(0, 150)}
            {"... "}
            <Link
              href={`/clubs/${annonce.club.id}/announcements/${annonce.id}`}
              className="text-[#F5A623] text-xs hover:underline font-medium"
            >
              Read more
            </Link>
          </>
        ) : (
          annonce.content
        )}
      </p>

      {/* Footer */}
      <Link
        href={`/clubs/${annonce.club.id}/announcements/${annonce.id}`}
        className="flex items-center gap-1 text-gray-400 text-xs 
                   hover:text-[#F5A623] transition-colors w-fit"
      >
        <MessageCircle className="h-3 w-3" />
        {annonce._count.comments} comment
        {annonce._count.comments !== 1 ? "s" : ""}
      </Link>
    </div>
  );
}
