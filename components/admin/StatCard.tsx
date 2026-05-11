import React from "react";
import * as TablerIcons from "@tabler/icons-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: string;
};

export default function StatCard({ title, value, icon }: StatCardProps) {
  const IconComponent = (TablerIcons as any)[icon] || null;
  return (
    <div className="bg-white border border-gray-200 border-l-4 border-l-[#c0392b] shadow-sm rounded-lg p-6 flex flex-col gap-2 min-h-[120px]">
      <div className="flex items-center justify-between">
        <span className="text-[#111827] text-sm font-semibold uppercase tracking-wide">
          {title}
        </span>
        {IconComponent && (
          <span
            className="bg-[#fef2f2] text-[#c0392b] p-2 rounded-full"
            aria-hidden="true"
          >
            <IconComponent size={24} stroke={1.5} />
          </span>
        )}
      </div>
      <span className="text-[#c0392b] text-4xl font-bold mt-2">{value}</span>
    </div>
  );
}
