import React from "react";
import Link from "next/link";

const NAVY = "#0d1b3e";
const CRIMSON = "#c0392b";

export default function AuthLeftPanel({
  badge,
  heading,
  subtitle,
  bullets,
}: {
  badge: string;
  heading: React.ReactNode;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <div className="hidden md:flex md:w-[45%] bg-[#0d1b3e] flex-col justify-center px-12 lg:px-16 py-16 relative overflow-hidden">
      {/* Decorative grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 40px)",
        }}
      />
      {/* Top-right white square */}
      <div
        aria-hidden="true"
        className="absolute top-8 right-8 w-16 h-16 border-2 border-white opacity-30 rounded-none z-10"
      />
      {/* Bottom-right crimson square */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 right-16 w-12 h-12 border-2 border-[#c0392b] rounded-none z-10"
      />
      {/* Logo */}
      <div className="flex items-center gap-3 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 select-none group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
        >
          <span className="w-10 h-10 flex items-center justify-center rounded bg-[#c0392b] text-white text-2xl font-bold">
            U
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-[#c0392b] transition">
            Uni<span className="text-[#e74c3c]">Clubs</span>
          </span>
        </Link>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-6 pt-16 z-20">
        <span className="inline-block bg-[#c0392b] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 mb-6">
          {badge}
        </span>
        <h1 className="text-white text-4xl lg:text-5xl font-serif font-normal leading-tight mb-4">
          {heading}
        </h1>
        <p className="text-white/80 text-sm leading-relaxed max-w-sm">
          {subtitle}
        </p>
        <ul className="flex flex-col gap-3 mt-6">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-white/[0.87] text-sm"
            >
              <span
                className="inline-block w-4 h-4 bg-[#c0392b] mr-2 flex items-center justify-center rounded-none"
                aria-hidden="true"
              >
                <span className="block w-2 h-2 bg-white rounded-none" />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
