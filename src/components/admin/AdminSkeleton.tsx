import { Skeleton } from "../ui/skeleton";

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8DCEB] bg-white shadow-sm">
      <div className="border-b border-[#E8DCEB] px-5 py-4">
        <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.6fr] gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-3 bg-[#EEE7EF]" />
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#F1ECF2]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.6fr] items-center gap-5 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg bg-[#EEE7EF]" />
              <Skeleton className="h-3 w-32 bg-[#EEE7EF]" />
            </div>
            <Skeleton className="h-3 w-16 bg-[#EEE7EF]" />
            <Skeleton className="h-6 w-20 rounded-full bg-[#EEE7EF]" />
            <Skeleton className="ml-auto h-8 w-16 rounded-lg bg-[#EEE7EF]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-full px-4 pb-8 pt-5 sm:px-6 md:px-8">
      <div className="flex items-end justify-between">
        <div className="space-y-3">
          <Skeleton className="h-12 w-52 bg-[#EEE7EF]" />
          <Skeleton className="h-3 w-72 max-w-[70vw] bg-[#EEE7EF]" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-[#E8DCEB] bg-white p-5">
            <Skeleton className="h-3 w-24 bg-[#EEE7EF]" />
            <Skeleton className="mt-5 h-8 w-16 bg-[#EEE7EF]" />
            <Skeleton className="mt-4 h-2 w-full bg-[#EEE7EF]" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-[#E8DCEB] bg-white p-6">
          <Skeleton className="h-5 w-36 bg-[#EEE7EF]" />
          <div className="mt-8 space-y-7">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-3 w-28 bg-[#EEE7EF]" />
                <Skeleton className="mt-3 h-2.5 w-full bg-[#EEE7EF]" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8DCEB] bg-white p-6">
          <Skeleton className="h-4 w-28 bg-[#EEE7EF]" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full bg-[#EEE7EF]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
