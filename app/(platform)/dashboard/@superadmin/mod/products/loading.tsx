import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      {/* Header skeleton */}
      <div className="space-y-2 mb-5">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-[450px]" />
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

          {/* Table header - Products columns */}
          <div className="border-t px-4 py-3 grid grid-cols-7 gap-4">
            <Skeleton className="h-5 w-24" /> {/* Imagen */}
            <Skeleton className="h-5 w-32" /> {/* Producto */}
            <Skeleton className="h-5 w-24" /> {/* Marca */}
            <Skeleton className="h-5 w-28" /> {/* Categoría */}
            <Skeleton className="h-5 w-20" /> {/* Precio */}
            <Skeleton className="h-5 w-24" /> {/* Creado */}
            <Skeleton className="h-5 w-20" /> {/* Acciones */}
          </div>

          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border-t px-4 py-4 grid grid-cols-7 gap-4 items-center hover:bg-gray-50/50 cursor-pointer"
            >
              <Skeleton className="h-16 w-16 rounded-md" />{" "}
              {/* Imagen del producto */}
              <div className="space-y-1">
                <Skeleton className="h-5 w-36" /> {/* Nombre */}
                <Skeleton className="h-4 w-28" /> {/* SKU */}
              </div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-20" /> {/* Precio */}
                <Skeleton className="h-4 w-16" /> {/* Descuento */}
              </div>
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
