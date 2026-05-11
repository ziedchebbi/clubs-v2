import React from "react";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clubs", label: "Clubs" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/memberships", label: "Memberships" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 w-56 h-screen bg-[#0d1b3e] flex-col z-40">
      <div className="h-16 flex items-center px-8 text-2xl font-bold select-none text-white">
        Uni<span className="text-[#e74c3c]">Clubs</span>
      </div>
      <nav className="flex-1 mt-8">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-8 py-3 rounded-l-none font-semibold transition-all duration-200 text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                aria-current={
                  typeof window !== "undefined" &&
                  window.location.pathname === item.href
                    ? "page"
                    : undefined
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
