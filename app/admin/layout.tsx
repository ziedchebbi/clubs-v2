import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Sidebar for desktop, mobile handled in Sidebar */}
      <Sidebar />
      {/* Main content area */}
      <div className="md:ml-64 pt-14 md:pt-0">
        <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
