"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, BookMarked } from "lucide-react";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/feed", icon: Home },
    { label: "Clubs", href: "/clubs", icon: Users },
    { label: "My Clubs", href: "/my-clubs", icon: BookMarked },
  ];

  const isActive = (href: string) =>
    href === "/feed" ? pathname === "/feed" : pathname.startsWith(href);

  return (
    <div className="space-y-1">
      {links.map((link) => {
        const active = isActive(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors text-sm font-medium ${
              active
                ? "bg-[#FFF8EC] text-gray-900 border-l-4 border-[#F5A623]"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
