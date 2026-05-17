"use client";
import React, { useState } from "react";

export default function StudentsTable({
  users,
  currentUserId,
}: {
  users: any[];
  currentUserId: string;
}) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [data, setData] = useState(users);

  const filtered = data.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleRemove(id: string) {
    if (
      !confirm("Are you sure? This will remove the user and all memberships.")
    )
      return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setData((prev) => prev.filter((u) => u.id !== id));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#111827] placeholder-gray-500 focus:outline-none focus:border-[#0d1b3e] focus:ring-1 focus:ring-[#0d1b3e]"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-[#111827]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">
                Clubs Joined
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">
                Verified
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Joined Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 text-[#111827] font-medium whitespace-nowrap">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-[#4b5563] whitespace-nowrap">
                  {u.email}
                </td>
                <td className="px-4 py-3 text-[#4b5563] text-center">
                  {u._count.memberships}
                </td>
                <td className="px-4 py-3 text-[#4b5563] text-center">
                  {u.emailVerified ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      Yes
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-[#4b5563] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#4b5563] whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleRemove(u.id)}
                    disabled={loadingId === u.id}
                    className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
