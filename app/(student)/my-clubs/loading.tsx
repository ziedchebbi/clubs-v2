import { Skeleton } from "@/components/ui/skeleton";

export default function MyClubsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32 rounded-lg bg-gray-200" />
        <Skeleton className="h-4 w-48 rounded-lg bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 border-l-4 
                       border-l-gray-200 rounded-xl p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-2/3 rounded bg-gray-200" />
                <Skeleton className="h-3 w-full rounded bg-gray-200" />
                <Skeleton className="h-3 w-4/5 rounded bg-gray-200" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full bg-gray-200" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-3 w-24 rounded bg-gray-200" />
              <Skeleton className="h-3 w-24 rounded bg-gray-200" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1 rounded-lg bg-gray-200" />
              <Skeleton className="h-8 flex-1 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
