"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clubs", label: "Clubs" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/memberships", label: "Memberships" },
];

// TODO: Replace with real user info
const user = { name: "Admin User", email: "admin@example.com" };

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sidebar content
  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-white/10 select-none">
        <span className="text-white text-2xl font-bold tracking-tight">
          Uni<span className="text-[#ff9800]">Clubs</span>
        </span>
      </div>
      <nav className="flex-1 py-6">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    `block px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-11 min-w-11 ` +
                    (active
                      ? "bg-white text-[#000000] border-l-4 border-[#ff9800] font-bold shadow-sm"
                      : "text-gray-300 hover:bg-white/10 hover:text-white")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto border-t border-white/10 p-4">
        <div className="text-gray-400 text-xs font-semibold">{user.name}</div>
        <div className="text-gray-400 text-xs">{user.email}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-[#111827] z-40">
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#111827] flex items-center px-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="text-white mr-4 focus:outline-none focus:ring-2 focus:ring-[#c0392b] min-h-11 min-w-11"
          aria-label="Open menu"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="text-white text-xl font-bold tracking-tight select-none">
          Uni<span className="text-[#e74c3c]">Clubs</span>
        </span>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-64 h-full bg-[#111827] shadow-xl animate-slide-in-left">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#c0392b] min-h-11 min-w-11"
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              </svg>
            </button>
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}
