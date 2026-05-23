"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

type Props = {
  variant?: "icon" | "full";
};

export default function LogoutButton({ variant = "full" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
      router.push("/");
      router.refresh();
    });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        aria-label="Sign out"
        className="text-gray-400 hover:text-red-400 transition-colors 
                   disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 text-gray-400 hover:text-red-400 
                 text-sm transition-colors disabled:opacity-50 w-full"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
