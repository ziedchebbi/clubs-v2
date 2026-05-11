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
        className="uppercase text-[12px] font-semibold tracking-widest text-[#555] mb-1"
        style={{ letterSpacing: 1.2 }}
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
        className="w-full px-4 py-[13px] text-[15px] border border-[#ddd] focus:outline-none"
        style={{
          borderRadius: 0,
          borderColor: focused ? "#0d1b3e" : "#ddd",
          transition: "border-color 0.2s",
        }}
        autoComplete={name}
      />
    </div>
  );
}
