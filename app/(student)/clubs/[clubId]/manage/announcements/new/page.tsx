import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import CreateAnnonceForm from "@/components/student/CreateAnnonceForm";

export default async function NewAnnouncementPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const membership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId, clubId } },
  });

  if (
    !membership ||
    (membership.role !== EMemberRole.OFFICER &&
      membership.role !== EMemberRole.CHAIR)
  ) {
    notFound();
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-gray-900 font-semibold text-lg">
        Create Announcement
      </h2>
      <CreateAnnonceForm clubId={clubId} />
    </div>
  );
}
