"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

type University = {
  id: string;
  name: string;
  _count: { clubs: number };
};

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUniversities = async () => {
    setIsLoading(true);
    const res = await fetch("/api/universities");
    if (res.ok) {
      const { data } = await res.json();
      setUniversities(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await fetch("/api/universities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setNewName("");
    await fetchUniversities();
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Manage Universities</h1>
        <p className="text-sm text-[#64748b] mt-1">Add or remove universities from the platform.</p>
      </header>
      <div className="border-b border-[#e2e8f0] mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0]">
            <table className="w-full">
              <thead className="bg-[#0d1b2a] text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">University Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Clubs</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {isLoading ? (
                  <tr><td colSpan={3} className="text-center p-8 text-sm text-[#64748b]">Loading...</td></tr>
                ) : (
                  universities.map((uni) => (
                    <tr key={uni.id} className="hover:bg-[#f8fafc]">
                      <td className="px-4 py-3 text-sm font-medium text-[#1e293b]">{uni.name}</td>
                      <td className="px-4 py-3 text-sm text-[#1e293b]">{uni._count?.clubs ?? 0}</td>
                      <td className="px-4 py-3">
                        <button className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg text-xs" aria-label={`Delete ${uni.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
            <h3 className="font-bold text-[#0d1b2a] mb-4">Add New University</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1">University Name</label>
                <input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} required className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-[#0d1b2a] font-semibold px-4 py-2 rounded-lg">
                <Plus className="h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add University"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
