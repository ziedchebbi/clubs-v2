"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2 } from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Clubs", href: "/admin/clubs", icon: Building2 },
  { label: "Students", href: "/admin/members", icon: Users },
];

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {links.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 
                          rounded-lg transition-colors text-sm font-medium
                ${
                  isActive
                    ? "bg-white text-gray-900 border-l-4 border-[#F5A623] shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
