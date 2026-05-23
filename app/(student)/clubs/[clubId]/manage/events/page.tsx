import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

export default async function ManageEventsPage({
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

  const events = await prisma.event.findMany({
    where: { clubId },
    orderBy: { createdAt: "desc" },
    include: {
      organizer: { select: { name: true } },
      _count: { select: { attendees: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 font-semibold text-lg">Events</h2>
        <Button
          asChild
          className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                     font-semibold text-xs"
          size="sm"
        >
          <Link href={`/clubs/${clubId}/manage/events/new`}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div
          className="bg-white border border-gray-200 rounded-xl p-8 
                        text-center text-gray-400 text-sm shadow-sm"
        >
          No events yet — create your first one
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-xl p-4 
                         flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#FFF8EC] rounded-lg p-2 shrink-0">
                  <Calendar className="h-4 w-4 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-sm">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    {event.startsAt && (
                      <span>
                        {format(
                          new Date(event.startsAt),
                          "MMM d, yyyy · h:mm a",
                        )}
                      </span>
                    )}
                    <span>·</span>
                    <span>{event._count.attendees} attending</span>
                    <span>·</span>
                    <span>by {event.organizer.name}</span>
                    {event.isPublic && (
                      <>
                        <span>·</span>
                        <span className="text-green-500">Public</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href={`/clubs/${clubId}/events/${event.id}`}
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
