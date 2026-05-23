"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  clubId: string;
  isChair: boolean;
};

export default function ManageNavLinks({ clubId, isChair }: Props) {
  const pathname = usePathname();

  const links = [
    { label: "Overview", href: `/clubs/${clubId}/manage` },
    { label: "Join Requests", href: `/clubs/${clubId}/manage/requests` },
    { label: "Events", href: `/clubs/${clubId}/manage/events` },
    { label: "Announcements", href: `/clubs/${clubId}/manage/announcements` },
    ...(isChair
      ? [{ label: "Members", href: `/clubs/${clubId}/manage/members` }]
      : []),
  ];

  return (
    <nav
      className="flex gap-1 border-b border-gray-200 pb-0"
      aria-label="Manage club navigation"
    >
      {links.map((link) => {
        const isActive =
          link.href === `/clubs/${clubId}/manage`
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2.5 text-sm font-medium transition-colors
              ${
                isActive
                  ? "text-[#F5A623] border-b-2 border-[#F5A623] -mb-px"
                  : "text-gray-500 hover:text-gray-900"
              }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
