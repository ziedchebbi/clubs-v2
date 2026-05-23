"use client";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/app/(student)/clubs/[clubId]/manage/events/actions";

type Props = { clubId: string };

export default function CreateEventForm({ clubId }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!title.trim()) return setError("Title is required");
    setError("");

    startTransition(async () => {
      const result = await createEvent(clubId, {
        title: title.trim(),
        content: content.trim() || null,
        startsAt: startsAt || null,
        isPublic,
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
          Title <span className="text-red-400">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="bg-gray-50 border-gray-200 text-gray-900 
                     placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">Description</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is this event about?"
          rows={4}
          className="bg-gray-50 border-gray-200 text-gray-900 
                     placeholder:text-gray-400 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">Date & Time</label>
        <Input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          className="bg-gray-50 border-gray-200 text-gray-900"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 accent-[#F5A623]"
        />
        <label htmlFor="isPublic" className="text-gray-700 text-sm">
          Make this event public (visible to non-members)
        </label>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !title.trim()}
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold"
        >
          {isPending ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
}
