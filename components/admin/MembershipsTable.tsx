"use client";
import React, { useState } from "react";

const ROLE_COLORS: Record<string, string> = {
  CHAIR: "bg-[#ffe0b2] text-[#7a4900]", // orange badge
  OFFICER: "bg-[#e3f2fd] text-[#1a237e]", // blue badge
  MEMBER: "bg-[#f5f5f5] text-[#4a3728]", // neutral badge
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
        <label
          htmlFor="club-filter"
          className="font-semibold text-sm text-[#ff9800]"
        >
          Club:
        </label>
        <select
          id="club-filter"
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className="border border-[#ff9800] bg-white text-[#1a1a1a] placeholder-[#ff9800] rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff9800] focus:ring-1 focus:ring-[#ff9800]"
        >
          <option value="">All Clubs</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#ff9800] overflow-x-auto">
        <table className="min-w-full divide-y divide-[#ff9800]">
          <thead className="bg-[#0a1436]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#ff9800] uppercase tracking-widest">
                Member Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#ff9800] uppercase tracking-widest">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#ff9800] uppercase tracking-widest">
                Club
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#ff9800] uppercase tracking-widest">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#ff9800] uppercase tracking-widest">
                Joined Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#ff9800] uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr
                key={m.user.id + m.club.id}
                className={
                  (i % 2 === 0 ? "bg-white" : "bg-white") +
                  " hover:bg-[#fff3e0] transition-colors"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-[#1a1a1a]">
                  {m.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#4a3728]">
                  {m.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#4a3728]">
                  {m.club.name}
                </td>
                <td className="px-6 py-4 text-center">
                  <RoleBadge role={m.role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#4a3728]">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <select
                    value={m.role}
                    onChange={(e) =>
                      handleRoleChange(m.user.id, m.club.id, e.target.value)
                    }
                    disabled={loading === m.user.id + m.club.id}
                    className="px-2 py-1 rounded border border-[#ff9800] bg-white text-[#1a1a1a] text-xs focus:outline-none focus:border-[#ff9800] focus:ring-1 focus:ring-[#ff9800]"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="OFFICER">Officer</option>
                    <option value="CHAIR">President</option>
                  </select>
                  <button
                    onClick={() => handleRemove(m.user.id, m.club.id)}
                    disabled={loading === m.user.id + m.club.id}
                    className="inline-block px-3 py-1 text-xs font-semibold bg-[#fdecea] border border-red-200 text-[#b71c1c] hover:bg-red-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200 disabled:opacity-60"
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
