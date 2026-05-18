"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

type JoinButtonProps = {
  clubId: string;
  userRole: 'PRESIDENT' | 'MEMBER' | null;
};

export default function JoinButton({ clubId, userRole }: JoinButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (status !== "authenticated") {
      router.push("/sign-in");
      return;
    }
    setIsLoading(true);
    await fetch(`/api/clubs/${clubId}/memberships`, { method: "POST" });
    router.refresh();
    setIsLoading(false);
  };

  const handleLeave = async () => {
    setIsLoading(true);
    await fetch(`/api/clubs/${clubId}/memberships`, { method: "DELETE" });
    router.refresh();
    setIsLoading(false);
  };

  if (status !== "authenticated") {
    return <Button onClick={handleJoin} disabled={isLoading}>Join Club</Button>;
  }

  if (userRole === 'MEMBER') {
    return <Button variant="destructive" onClick={handleLeave} disabled={isLoading}>Leave Club</Button>;
  }

  if (userRole === 'PRESIDENT') {
    return <Button disabled>You are the President</Button>;
  }

  return <Button onClick={handleJoin} disabled={isLoading}>Join Club</Button>;
}
