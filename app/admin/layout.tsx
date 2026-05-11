import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const NAVY = "#0d1b3e";
const CRIMSON = "#c0392b";
const BG_LIGHT = "#f7f5f0";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clubs", label: "Clubs" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/memberships", label: "Memberships" },
];

function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside
      className="h-screen w-64 flex-shrink-0 flex flex-col"
      style={{
        background: NAVY,
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        className="h-16 flex items-center px-8 text-2xl font-extrabold tracking-tight select-none"
        style={{ color: "#fff" }}
      >
        Uni<span style={{ color: CRIMSON }}>Clubs</span>
      </div>
      <nav className="flex-1 mt-8">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active =
              currentPath === item.href ||
              (item.href !== "/admin" && currentPath.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    `block px-8 py-3 rounded-l-full font-semibold transition-colors ` +
                    (active
                      ? `bg-white text-[${NAVY}] border-l-4 border-[${CRIMSON}]`
                      : `hover:bg-[${CRIMSON}] hover:text-white text-white`)
                  }
                  style={
                    active
                      ? {
                          background: "#fff",
                          color: NAVY,
                          borderLeft: `4px solid ${CRIMSON}`,
                        }
                      : {}
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "ADMIN") redirect("/");

  const headersList = await headers();
  const currentPath = headersList.get("x-invoke-path") || "/admin";

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Sidebar currentPath={currentPath} />
      <main
        className="flex-1 min-h-screen"
        style={{ background: BG_LIGHT, padding: 32 }}
      >
        {children}
      </main>
    </div>
  );
}
