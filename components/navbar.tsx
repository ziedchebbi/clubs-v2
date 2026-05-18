"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/clubs", label: "Clubs" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-[#0d1b2a] sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        <Link href="/" className="text-xl font-bold">
          <span className="text-white">Uni</span>
          <span className="text-amber-500">Clubs</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="h-10 w-44 bg-slate-700/50 rounded-full animate-pulse" />
          ) : user ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback className="bg-amber-500 text-[#0d1b2a] font-bold">
                    {user.name?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2">
                <div className="p-2 border-b border-slate-200">
                  <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <nav className="mt-2">
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                    <LayoutDashboard className="h-4 w-4" /> My Dashboard
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      <Settings className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => signOut({ redirect: "/" })} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </nav>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="border border-white text-white bg-transparent hover:bg-white/10 rounded-full px-5 py-2 text-sm font-medium">
                Log In
              </Link>
              <Link href="/sign-up" className="bg-amber-500 hover:bg-amber-600 text-[#0d1b2a] font-semibold rounded-full px-5 py-2 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
