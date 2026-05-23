import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddCommentForm from "@/components/student/AddCommentForm";
import CommentList from "@/components/student/CommentList";

export default async function AnnouncementPage({
  params,
}: {
  params: Promise<{ clubId: string; annonceId: string }>;
}) {
  const { clubId, annonceId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const annonce = await prisma.annonce.findUnique({
    where: { id: annonceId },
    include: {
      author: { select: { name: true, image: true } },
      club: { select: { id: true, name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { name: true, image: true } },
        },
      },
    },
  });

  if (!annonce || annonce.status !== "PUBLISHED" || annonce.clubId !== clubId) {
    notFound();
  }

  const serializedComments = annonce.comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    author: c.author,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={`/clubs/${clubId}`}
        className="flex items-center gap-1.5 text-gray-500 
                   hover:text-[#F5A623] text-sm transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {annonce.club.name}
      </Link>

      {/* Announcement card */}
      <div
        className="bg-white border border-gray-200 border-l-4 
                      border-l-[#F5A623] rounded-xl p-6 space-y-4 shadow-sm"
      >
        {/* Author row */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={annonce.author.image ?? undefined}
              alt={annonce.author.name}
            />
            <AvatarFallback className="bg-[#FFF8EC] text-[#F5A623] font-semibold">
              {annonce.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-gray-900 font-semibold text-sm">
              {annonce.author.name}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>in</span>
              <Link
                href={`/clubs/${clubId}`}
                className="text-[#F5A623] hover:underline font-medium"
              >
                {annonce.club.name}
              </Link>
              <span>·</span>
              <time>
                {new Date(annonce.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {annonce.content}
        </p>
      </div>

      {/* Comments section */}
      <div className="space-y-4">
        <h2 className="text-gray-900 font-semibold text-lg">
          Comments ({annonce.comments.length})
        </h2>

        <CommentList comments={serializedComments} />

        <AddCommentForm annonceId={annonceId} clubId={clubId} />
      </div>
    </div>
  );
}
