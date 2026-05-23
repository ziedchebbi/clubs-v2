"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { assignChair } from "@/app/(admin)/admin/clubs/actions";
import { Check } from "lucide-react";

type User = { id: string; name: string; email: string };

type Props = {
  clubId: string;
  users: User[];
};

export default function AssignChairForm({ clubId, users }: Props) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!selectedUserId) return setError("Please select a user");
    setError("");

    startTransition(async () => {
      const result = await assignChair(clubId, selectedUserId);
      if (result.error) setError(result.error);
      else setSuccess(true);
    });
  };

  if (success) {
    return (
      <div
        className="bg-green-50 border border-green-200 rounded-xl p-4 
                      flex items-center gap-2 text-green-600 text-sm"
      >
        <Check className="h-4 w-4" />
        Chair assigned successfully
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 
                    space-y-4 shadow-sm"
    >
      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">
          Select User <span className="text-red-400">*</span>
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 
                     text-gray-900 text-sm px-3 py-2 focus:outline-none 
                     focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
        >
          <option value="">Select a user...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {u.email}
            </option>
          ))}
        </select>
        {users.length === 0 && (
          <p className="text-gray-400 text-xs">
            All users are already members of this club
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !selectedUserId}
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold"
          size="sm"
        >
          {isPending ? "Assigning..." : "Assign as Chair"}
        </Button>
      </div>
    </div>
  );
}
