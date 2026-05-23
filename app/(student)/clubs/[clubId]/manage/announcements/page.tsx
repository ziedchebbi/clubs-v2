import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";
import { format } from "date-fns";

export default async function ManageAnnouncementsPage({
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

  const annonces = await prisma.annonce.findMany({
    where: { clubId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 font-semibold text-lg">Announcements</h2>
        <Button
          asChild
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold text-xs"
          size="sm"
        >
          <Link href={`/clubs/${clubId}/manage/announcements/new`}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Announcement
          </Link>
        </Button>
      </div>

      {annonces.length === 0 ? (
        <div
          className="bg-white border border-gray-200 rounded-xl p-8 
                        text-center text-gray-400 text-sm shadow-sm"
        >
          No announcements yet — create your first one
        </div>
      ) : (
        <div className="space-y-3">
          {annonces.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-gray-200 rounded-xl p-4 
                         flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#FFF8EC] rounded-lg p-2 shrink-0">
                  <Megaphone className="h-4 w-4 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm line-clamp-1">
                    {a.content.slice(0, 60)}
                    {a.content.length > 60 ? "..." : ""}
                  </p>
                  <div
                    className="flex items-center gap-2 text-xs 
                                  text-gray-400 mt-0.5"
                  >
                    <span>{format(new Date(a.createdAt), "MMM d, yyyy")}</span>
                    <span>·</span>
                    <span>by {a.author.name}</span>
                    <span>·</span>
                    <span>{a._count.comments} comments</span>
                    <span>·</span>
                    <span
                      className={
                        a.status === "PUBLISHED"
                          ? "text-green-500"
                          : "text-gray-400"
                      }
                    >
                      {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={`/clubs/${clubId}/announcements/${a.id}`}
                className="text-[#F5A623] text-xs hover:underline shrink-0"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
