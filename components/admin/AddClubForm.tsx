"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface University {
  id: string;
  name: string;
}

export default function AddClubForm({
  universities,
}: {
  universities: University[];
}) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Club name is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio: bio || undefined,
          universityId: universityId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add club");
      setName("");
      setBio("");
      setUniversityId("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md"
    >
      <div>
        <label
          htmlFor="club-name"
          className="block text-xs font-bold uppercase tracking-wide text-[#374151] mb-2"
        >
          Club Name <span className="text-[#c0392b]">*</span>
        </label>
        <input
          id="club-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 text-sm text-[#111827] placeholder-[#9ca3af] rounded-none focus:outline-none focus:border-[#0d1b3e] focus:ring-1 focus:ring-[#0d1b3e]"
          required
        />
      </div>
      <div>
        <label
          htmlFor="club-bio"
          className="block text-xs font-bold uppercase tracking-wide text-[#374151] mb-2"
        >
          Bio
        </label>
        <textarea
          id="club-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 text-sm text-[#111827] placeholder-[#9ca3af] rounded-none focus:outline-none focus:border-[#0d1b3e] focus:ring-1 focus:ring-[#0d1b3e]"
          rows={3}
        />
      </div>
      <div>
        <label
          htmlFor="university"
          className="block text-xs font-bold uppercase tracking-wide text-[#374151] mb-2"
        >
          University
        </label>
        <select
          id="university"
          value={universityId}
          onChange={(e) => setUniversityId(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 text-sm text-[#111827] rounded-none focus:outline-none focus:border-[#0d1b3e] focus:ring-1 focus:ring-[#0d1b3e]"
        >
          <option value="">Select a university</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div className="bg-[#fef2f2] border border-red-200 text-[#991b1b] text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#ff9800] hover:bg-[#e98c00] text-white font-semibold px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
      >
        {loading ? "Adding..." : "Add Club"}
      </button>
    </form>
  );
}
