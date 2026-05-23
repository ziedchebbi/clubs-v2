import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import EventAttendButton from "@/components/student/EventAttendButton";
import CommentList from "@/components/student/CommentList";
import AddEventCommentForm from "@/components/student/AddEventCommentForm";

export default async function EventPage({
  params,
}: {
  params: Promise<{ clubId: string; eventId: string }>;
}) {
  const { clubId, eventId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const [event, attendance, membership] = await Promise.all([
    prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: { select: { name: true, image: true } },
        club: { select: { id: true, name: true } },
        _count: { select: { attendees: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { name: true, image: true } },
          },
        },
      },
    }),
    prisma.eventAttendee.findUnique({
      where: { userId_eventId: { userId, eventId } },
    }),
    prisma.membership.findUnique({
      where: { userId_clubId: { userId, clubId } },
    }),
  ]);

  if (!event || event.clubId !== clubId) notFound();

  const canAccess = event.isPublic || !!membership;
  if (!canAccess) notFound();

  const isAttending = !!attendance;
  const attendeeCount = event._count.attendees;

  const serializedComments = event.comments.map((c) => ({
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
        Back to {event.club?.name ?? "Club"}
      </Link>

      {/* Event card */}
      <div
        className="bg-white border border-gray-200 border-l-4 
                      border-l-[#F5A623] rounded-xl p-6 space-y-6 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="bg-blue-50 text-blue-600 text-xs font-semibold 
                               rounded-full px-2 py-0.5 border border-blue-100"
              >
                Event
              </span>
              {event.isPublic && (
                <span
                  className="bg-green-50 text-green-600 text-xs 
                                 font-semibold rounded-full px-2 py-0.5 
                                 border border-green-100"
                >
                  Public
                </span>
              )}
              {event.club && (
                <Link
                  href={`/clubs/${event.club.id}`}
                  className="text-[#F5A623] text-xs font-medium hover:underline"
                >
                  {event.club.name}
                </Link>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          </div>

          <EventAttendButton
            eventId={eventId}
            clubId={clubId}
            isAttending={isAttending}
          />
        </div>

        {/* Attendee count */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <Users className="h-4 w-4 text-[#F5A623]" />
          <span>
            <span className="text-[#F5A623] font-semibold">
              {attendeeCount}
            </span>{" "}
            {attendeeCount === 1 ? "person" : "people"} attending
          </span>
        </div>

        {/* Meta info */}
        <div className="space-y-3 py-4 border-y border-gray-100">
          {event.startsAt && (
            <>
              <div className="flex items-center gap-3">
                <div className="bg-[#FFF8EC] rounded-lg p-2">
                  <Calendar className="h-4 w-4 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Date</p>
                  <p className="text-gray-900 font-medium text-sm">
                    {format(new Date(event.startsAt), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FFF8EC] rounded-lg p-2">
                  <Clock className="h-4 w-4 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Time</p>
                  <p className="text-gray-900 font-medium text-sm">
                    {format(new Date(event.startsAt), "h:mm a")}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <div className="bg-[#FFF8EC] rounded-lg p-2">
              <User className="h-4 w-4 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Organized by</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={event.organizer.image ?? undefined}
                    alt={event.organizer.name}
                  />
                  <AvatarFallback
                    className="bg-[#FFF8EC] text-[#F5A623] 
                                             text-[10px] font-semibold"
                  >
                    {event.organizer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-gray-900 font-medium text-sm">
                  {event.organizer.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {event.content && (
          <div className="space-y-2">
            <h2 className="text-gray-900 font-semibold text-sm">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {event.content}
            </p>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className="space-y-4">
        <h2 className="text-gray-900 font-semibold text-lg">
          Comments ({serializedComments.length})
        </h2>
        <CommentList comments={serializedComments} />
        <AddEventCommentForm eventId={eventId} clubId={clubId} />
      </div>
    </div>
  );
}
