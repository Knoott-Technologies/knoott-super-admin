import { CartItem } from "@/app/(platform)/dashboard/@superadmin/users/contribution/[id]/_components/contribution-products";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Icon } from "../logo";

export const CartItemSummary = ({
  data,
  sm,
}: {
  data: CartItem;
  sm?: boolean;
}) => {
  return (
    <div
      className={cn(
        "hover:bg-sidebar flex flex-col w-full border border-transparent gap-y-3 p-2 bg-background"
      )}
    >
      <div className="w-full items-stretch justify-between flex gap-4">
        {/* Imagen del producto/tarjeta */}
        {(data.wedding_gift_card_id && (
          <div className="w-[20%] max-w-24 aspect-[3/4] relative overflow-hidden shrink-0 bg-muted rounded-[1%]">
            {(data.metadata?.image_url && (
              <>
                <span className="bg-gradient-to-b from-black/60 to-black/20 absolute inset-0 z-10" />

                <Image
                  src={data.metadata.image_url}
                  alt={data.metadata?.name || "Producto"}
                  fill
                  loading="lazy"
                  className="object-cover"
                />
              </>
            )) || (
              <span className="absolute inset-0 bg-muted flex items-center justify-center p-5" />
            )}
            <div className="inset-x-0 items-center justify-center flex flex-col absolute top-0 py-1 z-10">
              <span className="w-[5%] h-auto aspect-[16/8] bg-sidebar rounded-t-full shrink-0" />
              <span className="w-[18%] aspect-[16/4] bg-sidebar rounded-full" />
            </div>
            <div className="items-center justify-between flex w-full absolute top-0 p-1 z-10 text-background">
              <p className="text-[3px] font-bold leading-none max-w-[35%] truncate">
                {formatPrice(data.amount)}
              </p>
              <Icon variant={"white"} className="h-[4px]" />
            </div>
            <div className="flex relative flex-col flex-1 justify-start mt-[15%] p-1 z-20 w-full text-background">
              <span className="w-full h-fit items-start justify-start">
                <p className="text-[5px] opacity-100 leading-none w-full">
                  Knoott{" "}
                  <span className="opacity-100 uppercase font-serif">
                    {" "}
                    gift card
                  </span>
                </p>
                <h3 className="text-[7px] font-semibold w-full line-clamp-3 max-w-full">
                  {data.metadata.name || "Título de la Tarjeta"}
                </h3>
              </span>
            </div>
          </div>
        )) || (
          <div className="w-[20%] max-w-24 aspect-[3/4] relative overflow-hidden shrink-0 bg-muted border">
            {(data.metadata?.image_url && (
              <Image
                src={data.metadata.image_url}
                alt={data.metadata?.name || "Producto"}
                fill
                className="object-cover"
              />
            )) || (
              <span className="absolute inset-0 bg-muted flex items-center justify-center p-5" />
            )}
          </div>
        )}

        {/* Información y controles */}
        <div
          className={cn(
            "flex-1 flex flex-col gap-y-1 items-start justify-between py-2",
            sm && "py-0"
          )}
        >
          {/* Nombre y precio */}
          <div className="w-full flex flex-col gap-y-0">
            <span className="w-full flex items-center justify-between">
              <p
                className={cn(
                  "text-xs lg:text-sm text-muted-foreground leading-none",
                  sm && "text-xs lg:text-xs"
                )}
              >
                {data.wedding_gift_card_id ? "Tarjeta de Regalo" : "Producto"}
              </p>
            </span>
            <span
              className={cn(
                "truncate text-base lg:text-lg font-medium block",
                sm && "text-sm lg:text-base"
              )}
            >
              {data.metadata?.name || "Producto"}
            </span>
          </div>

          {/* Controles para editar monto y botón de eliminar */}
          <div className="w-full h-fit items-center justify-start flex">
            MXN {formatPrice(data.amount)}
          </div>
        </div>
      </div>
      {data.message && (
        <div className="w-full flex flex-col gap-y-1 items-start justify-between">
          <span className="w-full flex items-center justify-between">
            <p className="text-xs text-muted-foreground leading-none">
              Mensaje
            </p>
          </span>
          <span className="text-sm font-medium block w-full text-muted-foreground">
            {data.message}
          </span>
        </div>
      )}
    </div>
  );
};
