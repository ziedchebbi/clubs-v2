import { Skeleton } from "@/components/ui/skeleton";

export default function ClubsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32 rounded-lg bg-gray-200" />
        <Skeleton className="h-4 w-56 rounded-lg bg-gray-200" />
      </div>
      <Skeleton className="h-10 w-64 rounded-lg bg-gray-200" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 border-l-4 
                       border-l-gray-200 rounded-xl p-5 space-y-3 shadow-sm"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-2/3 rounded bg-gray-200" />
              <Skeleton className="h-3 w-1/3 rounded bg-gray-200" />
              <Skeleton className="h-3 w-full rounded bg-gray-200" />
              <Skeleton className="h-3 w-4/5 rounded bg-gray-200" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
              <Skeleton className="h-8 w-16 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
