import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      {/* Header with date range selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-[400px]" />
        </div>
        {/* Date range selector skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        {/* Financial cards and breakdown */}
        <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-7">
          {/* Balance card */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>

          {/* Income card */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>

          {/* Expense card */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>

          {/* Expense breakdown card */}
          <Card className="flex-1 flex flex-col gap-y-0">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="bg-sidebar flex flex-col gap-y-1 h-full">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm gap-4 py-1"
                >
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center gap-2 shrink-0">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16 rounded-sm" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Table skeleton */}
        <div className="w-full border rounded-lg">
          {/* Search and filters */}
          <div className="p-4 flex justify-between items-center">
            <Skeleton className="h-10 w-[300px]" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Table header - Financial transactions columns */}
          <div className="border-t px-4 py-3 grid grid-cols-6 gap-4">
            <Skeleton className="h-5 w-32" /> {/* ID/Reference */}
            <Skeleton className="h-5 w-28" /> {/* Date */}
            <Skeleton className="h-5 w-32" /> {/* Type */}
            <Skeleton className="h-5 w-40" /> {/* Description */}
            <Skeleton className="h-5 w-24" /> {/* Amount */}
            <Skeleton className="h-5 w-24" /> {/* Status */}
          </div>

          {/* Table rows */}
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="border-t px-4 py-4 grid grid-cols-6 gap-4 items-center"
            >
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          ))}

          {/* Pagination */}
          <div className="border-t p-4 flex justify-between items-center">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-2 items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-16" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
