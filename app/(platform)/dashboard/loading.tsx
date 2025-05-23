import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      {/* Header skeleton */}
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-5 w-[320px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        {/* Cards skeleton */}
        <div className="w-full h-fit grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-5 lg:gap-7">
          {/* Balance actual */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>

          {/* Mesas activas */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Retiros pendientes */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Pagos pendientes */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Órdenes por confirmar */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Transaction chart skeleton */}
        <div className="w-full border rounded-lg">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="p-6 h-[400px]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
