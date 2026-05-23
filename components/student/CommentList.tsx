"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; image: string | null };
};

function CommentItem({ comment }: { comment: Comment }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(
      formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }),
    );
  }, [comment.createdAt]);

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage
          src={comment.author.image ?? undefined}
          alt={comment.author.name}
        />
        <AvatarFallback
          className="bg-[#FFF8EC] text-[#F5A623] 
                                   text-xs font-semibold"
        >
          {comment.author.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 text-sm font-medium">
            {comment.author.name}
          </span>
          {timeAgo && <time className="text-gray-400 text-xs">{timeAgo}</time>}
        </div>
        <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export default function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div
        className="bg-white border border-gray-200 rounded-xl p-6 
                      text-center text-gray-400 text-sm"
      >
        No comments yet. Be the first!
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-5 
                    space-y-4 shadow-sm"
    >
      {comments.map((comment, index) => (
        <div key={comment.id}>
          <CommentItem comment={comment} />
          {index < comments.length - 1 && (
            <div className="border-b border-gray-100 mt-4" />
          )}
        </div>
      ))}
    </div>
  );
}
