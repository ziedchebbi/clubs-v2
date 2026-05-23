import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center 
                    justify-center p-4"
    >
      <div className="text-center space-y-6 max-w-md">
        {/* Logo */}
        <div>
          <span className="font-bold text-2xl text-gray-900">Uni</span>
          <span className="font-bold text-2xl text-[#F5A623]">Clubs</span>
        </div>

        {/* 404 */}
        <div className="space-y-2">
          <p className="text-8xl font-bold text-[#F5A623]">404</p>
          <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
          <p className="text-gray-500 text-sm">
            The page you're looking for doesn't exist or you don't have access
            to it.
          </p>
        </div>

        {/* CTA */}
        <div
          className="flex flex-col sm:flex-row items-center 
                        justify-center gap-3"
        >
          <Button
            asChild
            className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                       font-semibold"
          >
            <Link href="/feed" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-200">
            <Link href="/clubs">Browse Clubs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
