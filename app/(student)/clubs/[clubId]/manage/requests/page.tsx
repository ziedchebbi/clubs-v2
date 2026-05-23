import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import RequestActions from "@/components/student/RequestActions";

export default async function ManageRequestsPage({
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

  const requests = await prisma.joinRequest.findMany({
    where: { clubId, status: "PENDING" },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 font-semibold text-lg">Join Requests</h2>
        <span
          className="bg-[#FFF8EC] text-[#F5A623] text-xs font-semibold 
                         rounded-full px-2 py-0.5"
        >
          {requests.length} pending
        </span>
      </div>

      {requests.length === 0 ? (
        <div
          className="bg-white border border-gray-200 rounded-xl p-8 
                        text-center text-gray-400 text-sm shadow-sm"
        >
          No pending requests
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-200 rounded-xl p-4 
                         flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={req.user.image ?? undefined}
                    alt={req.user.name}
                  />
                  <AvatarFallback
                    className="bg-[#FFF8EC] text-[#F5A623] 
                                             font-semibold"
                  >
                    {req.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900 font-medium text-sm">
                    {req.user.name}
                  </p>
                  <p className="text-gray-400 text-xs">{req.user.email}</p>
                  <p className="text-gray-300 text-xs mt-0.5">
                    Requested {format(new Date(req.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <RequestActions
                requestId={req.id}
                userId={req.user.id}
                clubId={clubId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
