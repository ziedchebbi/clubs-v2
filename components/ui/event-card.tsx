import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type EventCardProps = {
  id: string;
  title: string;
  content: string | null;
  startsAt: string | null;
  isPublic: boolean;
  clubId: string;
};

export default function EventCard({ title, content, startsAt, isPublic }: EventCardProps) {
  const eventDate = startsAt ? new Date(startsAt).toLocaleDateString() : "Date TBD";
  const eventTime = startsAt ? new Date(startsAt).toLocaleTimeString() : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Badge variant={isPublic ? "default" : "secondary"}>
            {isPublic ? "Public" : "Private"}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{eventDate} {eventTime}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}
