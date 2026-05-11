import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <h1 className="text-[#111827] text-2xl sm:text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-[#4b5563] text-sm mt-1">{description}</p>
      )}
    </div>
  );
}
