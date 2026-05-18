import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AnnonceCardProps = {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; image: string | null };
  commentCount: number;
};

export default function AnnonceCard({ content, createdAt, author, commentCount }: AnnonceCardProps) {
  const postDate = new Date(createdAt).toLocaleDateString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={author.image ?? ""} />
          <AvatarFallback>{author.name?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{author.name}</p>
          <p className="text-sm text-muted-foreground">{postDate}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">{commentCount} comment(s)</p>
      </CardFooter>
    </Card>
  );
}
