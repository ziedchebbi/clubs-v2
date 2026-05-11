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
    <div
      className="hidden md:flex flex-col justify-between h-full w-[45vw] min-w-[320px] relative overflow-hidden"
      style={{ background: NAVY }}
    >
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
        className="absolute top-8 right-8 w-16 h-16 border-2 border-white opacity-30 rounded-lg z-10"
      />
      {/* Bottom-right crimson square */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 right-16 w-12 h-12 border-2 border-[var(--crimson,#c0392b)] rounded-lg z-10"
        style={{ borderColor: CRIMSON }}
      />
      {/* Logo */}
      <div className="flex items-center gap-3 px-10 pt-10 z-20">
        <Link href="/" className="flex items-center gap-2 select-none group">
          <span
            className="w-10 h-10 flex items-center justify-center rounded bg-[var(--crimson,#c0392b)] text-white text-2xl font-bold"
            style={{ background: CRIMSON }}
          >
            U
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-[var(--crimson,#c0392b)] transition">
            Uni<span style={{ color: "#e74c3c" }}>Clubs</span>
          </span>
        </Link>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-6 px-10 pt-16 z-20">
        <span
          className="inline-block bg-[var(--crimson,#c0392b)] text-xs uppercase font-bold tracking-widest px-3 py-1 rounded text-white mb-2"
          style={{ background: CRIMSON }}
        >
          {badge}
        </span>
        <h1
          className="text-4xl md:text-5xl font-serif font-normal text-white leading-tight"
          style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}
        >
          {heading}
        </h1>
        <p
          className="text-white"
          style={{
            opacity: 0.6,
            fontSize: 15,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {subtitle}
        </p>
        <ul className="flex flex-col gap-3 mt-6">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-white"
              style={{ opacity: 0.87, fontSize: 15 }}
            >
              <span
                className="inline-block w-4 h-4 bg-transparent border-2 border-[var(--crimson,#c0392b)] mr-2 flex items-center justify-center"
                style={{ borderColor: CRIMSON }}
              >
                <span
                  className="block w-2 h-2 bg-[var(--crimson,#c0392b)]"
                  style={{ background: CRIMSON }}
                />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pb-10" />
    </div>
  );
}
