"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type University = {
  id: string;
  name: string;
};

export default function NewClubPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      const res = await fetch("/api/universities");
      const { data } = await res.json();
      setUniversities(data);
    };
    fetchUniversities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!universityId) {
      setError("Please select a university.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/clubs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, universityId }),
    });

    if (res.ok) {
      const { data } = await res.json();
      router.push(`/clubs/${data.id}`);
    } else {
      const { error } = await res.json();
      setError(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Create a New Club</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Fill out the details below to get started.
        </p>
      </header>
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1">Club Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>
          <div>
            <label htmlFor="bio" className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1">Bio / Description</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
          </div>
          <div>
            <label htmlFor="university" className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1">University</label>
            <select id="university" value={universityId} onChange={(e) => setUniversityId(e.target.value)} required className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="" disabled>Select a university</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#e2e8f0]">
            <Link href="/clubs" className="text-sm font-semibold text-[#64748b] hover:text-[#1e293b]">Cancel</Link>
            <button type="submit" disabled={isLoading} className="bg-amber-500 hover:bg-amber-600 text-[#0d1b2a] font-semibold px-4 py-2 rounded-lg">
              {isLoading ? "Creating..." : "Create Club"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
