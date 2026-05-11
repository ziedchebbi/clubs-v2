"use client";
import React, { useState } from "react";
import Link from "next/link";

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={
        role === "ADMIN"
          ? "bg-[#c0392b] text-white px-3 py-1 rounded-full text-xs font-bold"
          : "bg-[#0d1b3e] text-white px-3 py-1 rounded-full text-xs font-bold"
      }
    >
      {role}
    </span>
  );
}

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

  async function handleRoleChange(id: string, role: "ADMIN" | "USER") {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed");
      setData((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } finally {
      setLoadingId(null);
    }
  }

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
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs focus:outline-none focus:border-[#0d1b3e]"
        />
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#0d1b3e]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Clubs Joined
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#0d1b3e]">
                  {u.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 text-center">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-6 py-4 text-center">
                  {u._count.memberships}
                </td>
                <td className="px-6 py-4 text-center">
                  {u.emailVerified ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {u.role === "USER" && (
                    <button
                      onClick={() => handleRoleChange(u.id, "ADMIN")}
                      disabled={loadingId === u.id}
                      className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#c0392b] hover:bg-[#a93226] rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] disabled:opacity-60"
                    >
                      Promote to Admin
                    </button>
                  )}
                  {u.role === "ADMIN" && u.id !== currentUserId && (
                    <button
                      onClick={() => handleRoleChange(u.id, "USER")}
                      disabled={loadingId === u.id}
                      className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#0d1b3e] hover:bg-[#1a295c] rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d1b3e] disabled:opacity-60"
                    >
                      Demote to User
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(u.id)}
                    disabled={loadingId === u.id}
                    className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-60"
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
