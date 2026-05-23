import { Skeleton } from "@/components/ui/skeleton";

export default function FeedLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Heading */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 rounded-lg bg-gray-200" />
        <Skeleton className="h-4 w-64 rounded-lg bg-gray-200" />
      </div>

      {/* Three column grid */}
      <div className="xl:grid xl:grid-cols-[220px_1fr_220px] gap-8 items-start">
        {/* Left */}
        <div
          className="hidden xl:block bg-white border border-gray-200 
                        rounded-xl p-4 shadow-sm space-y-3"
        >
          <Skeleton className="h-4 w-24 rounded bg-gray-200" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-full rounded bg-gray-200" />
              <Skeleton className="h-4 w-12 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Center */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 pb-0">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-t-lg bg-gray-200" />
            ))}
          </div>

          {/* Feed cards */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 
                         space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-32 rounded bg-gray-200" />
                    <Skeleton className="h-3 w-48 rounded bg-gray-200" />
                  </div>
                </div>
                <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded bg-gray-200" />
                <Skeleton className="h-3 w-full rounded bg-gray-200" />
                <Skeleton className="h-3 w-3/4 rounded bg-gray-200" />
              </div>
              <Skeleton className="h-3 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Right */}
        <div
          className="hidden xl:block bg-white border border-gray-200 
                        rounded-xl p-4 shadow-sm space-y-3"
        >
          <Skeleton className="h-4 w-24 rounded bg-gray-200" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex gap-2 items-start py-2 border-b 
                         border-gray-100 last:border-0"
            >
              <Skeleton
                className="h-10 w-10 rounded-lg bg-gray-200 
                                   min-w-[40px]"
              />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-full rounded bg-gray-200" />
                <Skeleton className="h-2 w-16 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
