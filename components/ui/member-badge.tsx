import { Badge } from "@/components/ui/badge";

type MemberBadgeProps = {
  role: 'PRESIDENT' | 'MEMBER';
};

export default function MemberBadge({ role }: MemberBadgeProps) {
  return (
    <Badge variant={role === 'PRESIDENT' ? "default" : "secondary"}>
      {role}
    </Badge>
  );
}
