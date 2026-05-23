import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EUserRole } from "@/generated/prisma/enums";
import CreateClubForm from "@/components/admin/CreateClubForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewClubPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { university: true },
  });

  if (!user || user.role !== EUserRole.ADMIN || !user.university) {
    redirect("/feed");
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link
        href="/admin/clubs"
        className="flex items-center gap-1.5 text-gray-500 
                   hover:text-[#F5A623] text-sm transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clubs
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Club</h1>
        <p className="text-gray-500 text-sm mt-1">{user.university.name}</p>
      </div>
      <CreateClubForm universityId={user.university.id} />
    </div>
  );
}
