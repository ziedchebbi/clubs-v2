"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteClub } from "@/app/(admin)/admin/clubs/actions";
import { Trash2 } from "lucide-react";

type Props = { clubId: string; clubName: string };

export default function DeleteClubButton({ clubId, clubName }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !confirm(
        `Are you sure you want to delete "${clubName}"? This cannot be undone.`,
      )
    )
      return;

    startTransition(async () => {
      await deleteClub(clubId);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="border-red-200 text-red-400 hover:bg-red-50 
                 hover:text-red-500 text-xs shrink-0"
    >
      <Trash2 className="h-3.5 w-3.5 mr-1" />
      {isPending ? "Deleting..." : "Delete Club"}
    </Button>
  );
}
