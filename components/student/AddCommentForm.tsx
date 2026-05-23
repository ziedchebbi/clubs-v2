"use client";
import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addComment } from "@/app/(student)/clubs/[clubId]/announcements/actions";

type Props = {
  annonceId: string;
  clubId: string;
};

export default function AddCommentForm({ annonceId, clubId }: Props) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!content.trim()) return;
    setError("");

    startTransition(async () => {
      const result = await addComment(annonceId, clubId, content);
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
      }
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 
                    space-y-3 shadow-sm"
    >
      <p className="text-gray-900 font-medium text-sm">Write a comment</p>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="bg-gray-50 border-gray-200 text-gray-900 
                   placeholder:text-gray-400 resize-none text-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !content.trim()}
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold text-sm"
        >
          {isPending ? "Posting..." : "Post comment"}
        </Button>
      </div>
    </div>
  );
}
