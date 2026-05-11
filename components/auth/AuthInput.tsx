import React, { useState } from "react";

interface AuthInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export default function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={name}
        className="block text-[#374151] text-xs font-bold uppercase tracking-wide mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full border border-gray-300 px-4 py-3 text-[#111827] placeholder-[#9ca3af] text-sm focus:outline-none focus:border-[#0d1b3e] focus:ring-1 focus:ring-[#0d1b3e] rounded-none ${focused ? "ring-1 ring-[#0d1b3e] border-[#0d1b3e]" : ""}`}
        autoComplete={name}
      />
    </div>
  );
}
