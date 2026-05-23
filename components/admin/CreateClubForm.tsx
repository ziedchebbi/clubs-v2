"use client";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClub } from "@/app/(admin)/admin/clubs/actions";

type Props = { universityId: string };

export default function CreateClubForm({ universityId }: Props) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!name.trim()) return setError("Club name is required");
    setError("");
    startTransition(async () => {
      const result = await createClub(universityId, {
        name: name.trim(),
        bio: bio.trim() || null,
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
          Club Name <span className="text-red-400">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Photography Society"
          className="bg-gray-50 border-gray-200 text-gray-900 
                     placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">Description</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="What is this club about?"
          rows={4}
          className="bg-gray-50 border-gray-200 text-gray-900 
                     placeholder:text-gray-400 resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !name.trim()}
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold"
        >
          {isPending ? "Creating..." : "Create Club"}
        </Button>
      </div>
    </div>
  );
}
