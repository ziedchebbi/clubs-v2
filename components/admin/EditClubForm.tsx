"use client";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateClub } from "@/app/(admin)/admin/clubs/actions";
import { Check } from "lucide-react";

type Props = {
  clubId: string;
  initialName: string;
  initialBio: string;
};

export default function EditClubForm({
  clubId,
  initialName,
  initialBio,
}: Props) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!name.trim()) return setError("Club name is required");
    setError("");
    setSaved(false);

    startTransition(async () => {
      const result = await updateClub(clubId, {
        name: name.trim(),
        bio: bio.trim() || null,
      });
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 
                    space-y-4 shadow-sm"
    >
      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          className="bg-gray-50 border-gray-200 text-gray-900"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">Description</label>
        <Textarea
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
            setSaved(false);
          }}
          rows={3}
          className="bg-gray-50 border-gray-200 text-gray-900 resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex items-center justify-end gap-2">
        {saved && (
          <span className="flex items-center gap-1 text-green-500 text-xs">
            <Check className="h-3.5 w-3.5" />
            Saved
          </span>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold"
          size="sm"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
