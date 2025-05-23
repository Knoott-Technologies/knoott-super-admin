import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      {/* Header skeleton */}
      <div className="space-y-2 mb-5">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-5 w-[450px]" />
      </div>

      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        {/* Cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Total de usuarios */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Usuarios invitados */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Usuarios con mesa */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Usuarios partners */}
          <div className="border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-20" />
          </div>
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

          {/* Table header - Users columns */}
          <div className="border-t px-4 py-3 grid grid-cols-6 gap-4">
            <Skeleton className="h-5 w-32" /> {/* Usuario */}
            <Skeleton className="h-5 w-24" /> {/* Email */}
            <Skeleton className="h-5 w-20" /> {/* Tipo */}
            <Skeleton className="h-5 w-24" /> {/* Estado */}
            <Skeleton className="h-5 w-28" /> {/* Registrado */}
            <Skeleton className="h-5 w-20" /> {/* Acciones */}
          </div>

          {/* Table rows */}
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="border-t px-4 py-4 grid grid-cols-6 gap-4 items-center hover:bg-gray-50/50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
                <div className="space-y-1">
                  <Skeleton className="h-5 w-28" /> {/* Nombre */}
                  <Skeleton className="h-4 w-20" /> {/* Username */}
                </div>
              </div>
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-1">
                <Skeleton className="h-6 w-6 rounded-full" />{" "}
                {/* Icono invitado */}
                <Skeleton className="h-6 w-6 rounded-full" /> {/* Icono mesa */}
                <Skeleton className="h-6 w-6 rounded-full" />{" "}
                {/* Icono partner */}
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
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
