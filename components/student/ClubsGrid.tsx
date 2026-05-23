"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ClubCard from "@/components/student/ClubCard";

type Club = {
  id: string;
  name: string;
  bio: string | null;
  universityName: string | null;
  memberCount: number;
  isJoined: boolean;
  hasPendingRequest: boolean;
};

export default function ClubsGrid({ clubs }: { clubs: Club[] }) {
  const [search, setSearch] = useState("");

  const filtered = clubs.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 
                           h-4 w-4 text-gray-400"
        />
        <Input
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-gray-200 text-gray-900 
                     placeholder:text-gray-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 font-medium">No clubs found</p>
          <p className="text-gray-300 text-sm mt-1">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
}
