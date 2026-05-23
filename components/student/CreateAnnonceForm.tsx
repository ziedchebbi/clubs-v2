"use client";
import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAnnonce } from "@/app/(student)/clubs/[clubId]/manage/announcements/actions";

type Props = { clubId: string };

export default function CreateAnnonceForm({ clubId }: Props) {
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!content.trim()) return setError("Content is required");
    setError("");

    startTransition(async () => {
      const result = await createAnnonce(clubId, {
        content: content.trim(),
        isDraft,
      });
      if (result.error) setError(result.error);
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 
                    space-y-4 shadow-sm"
    >
      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">
          Content <span className="text-red-400">*</span>
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your announcement..."
          rows={6}
          className="bg-gray-50 border-gray-200 text-gray-900 
                     placeholder:text-gray-400 resize-none"
        />
        <p className="text-gray-400 text-xs text-right">
          {content.length} characters
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDraft"
          checked={isDraft}
          onChange={(e) => setIsDraft(e.target.checked)}
          className="h-4 w-4 accent-[#F5A623]"
        />
        <label htmlFor="isDraft" className="text-gray-700 text-sm">
          Save as draft (not visible to members)
        </label>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !content.trim()}
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold"
        >
          {isPending
            ? "Posting..."
            : isDraft
              ? "Save Draft"
              : "Post Announcement"}
        </Button>
      </div>
    </div>
  );
}
