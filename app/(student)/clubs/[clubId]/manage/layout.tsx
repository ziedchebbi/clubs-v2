import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EMemberRole } from "@/generated/prisma/enums";
import ManageNavLinks from "@/components/student/ManageNavLinks";
import { ArrowLeft } from "lucide-react";

export default async function ManageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const membership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId, clubId } },
    include: { club: { select: { name: true } } },
  });

  if (
    !membership ||
    (membership.role !== EMemberRole.OFFICER &&
      membership.role !== EMemberRole.CHAIR)
  ) {
    notFound();
  }

  const isChair = membership.role === EMemberRole.CHAIR;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/clubs/${clubId}`}
          className="flex items-center gap-1.5 text-gray-500 
                     hover:text-[#F5A623] text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {membership.club.name}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage {membership.club.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isChair ? "Chair" : "Officer"} dashboard
        </p>
      </div>

      <ManageNavLinks clubId={clubId} isChair={isChair} />

      <div>{children}</div>
    </div>
  );
}
