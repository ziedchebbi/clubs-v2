"use client";
import React, { useState } from "react";

const ROLE_COLORS: Record<string, string> = {
  CHAIR: "bg-amber-100 text-amber-800",
  OFFICER: "bg-indigo-100 text-indigo-800",
  MEMBER: "bg-gray-100 text-gray-700",
};

const ROLE_LABELS: Record<string, string> = {
  CHAIR: "President",
  OFFICER: "Officer",
  MEMBER: "Member",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export default function MembershipsTable({
  memberships,
  clubs,
  initialClubId,
}: {
  memberships: any[];
  clubs: any[];
  initialClubId?: string;
}) {
  const [clubId, setClubId] = useState(initialClubId || "");
  const [data, setData] = useState(memberships);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = clubId ? data.filter((m) => m.club.id === clubId) : data;

  async function handleRoleChange(
    userId: string,
    clubId: string,
    role: string,
  ) {
    setLoading(userId + clubId);
    try {
      const res = await fetch("/api/admin/memberships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, clubId, role }),
      });
      if (!res.ok) throw new Error("Failed");
      setData((prev) =>
        prev.map((m) =>
          m.user.id === userId && m.club.id === clubId ? { ...m, role } : m,
        ),
      );
    } finally {
      setLoading(null);
    }
  }

  async function handleRemove(userId: string, clubId: string) {
    if (!confirm("Remove this member from the club?")) return;
    setLoading(userId + clubId);
    try {
      const res = await fetch("/api/admin/memberships", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, clubId }),
      });
      if (!res.ok) throw new Error("Failed");
      setData((prev) =>
        prev.filter((m) => !(m.user.id === userId && m.club.id === clubId)),
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="club-filter" className="font-semibold text-sm">
          Club:
        </label>
        <select
          id="club-filter"
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0d1b3e]"
        >
          <option value="">All Clubs</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#0d1b3e]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Member Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Club
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Role
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
            {filtered.map((m) => (
              <tr key={m.user.id + m.club.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#0d1b3e]">
                  {m.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{m.user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.club.name}</td>
                <td className="px-6 py-4 text-center">
                  <RoleBadge role={m.role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <select
                    value={m.role}
                    onChange={(e) =>
                      handleRoleChange(m.user.id, m.club.id, e.target.value)
                    }
                    disabled={loading === m.user.id + m.club.id}
                    className="px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:border-[#0d1b3e]"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="OFFICER">Officer</option>
                    <option value="CHAIR">President</option>
                  </select>
                  <button
                    onClick={() => handleRemove(m.user.id, m.club.id)}
                    disabled={loading === m.user.id + m.club.id}
                    className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-60"
                  >
                    Remove from Club
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
