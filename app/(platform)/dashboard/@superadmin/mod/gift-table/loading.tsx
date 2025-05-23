import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      {/* Header skeleton */}
      <div className="space-y-2 mb-5">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-[520px]" />
      </div>

      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
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

          {/* Table header - Wedding verification columns */}
          <div className="border-t px-4 py-3 grid grid-cols-6 gap-4">
            <Skeleton className="h-5 w-32" /> {/* Pareja */}
            <Skeleton className="h-5 w-28" /> {/* Fecha de boda */}
            <Skeleton className="h-5 w-24" /> {/* Estado */}
            <Skeleton className="h-5 w-32" /> {/* Fecha solicitud */}
            <Skeleton className="h-5 w-28" /> {/* Documentos */}
            <Skeleton className="h-5 w-20" /> {/* Acciones */}
          </div>

          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border-t px-4 py-4 grid grid-cols-6 gap-4 items-center hover:bg-gray-50/50 cursor-pointer"
            >
              <div className="space-y-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-1">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
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
