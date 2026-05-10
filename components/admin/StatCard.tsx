import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
      <span className="text-lg font-semibold text-gray-700">{title}</span>
      <span className="text-3xl font-bold mt-2">{value}</span>
    </div>
  );
}
