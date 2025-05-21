import { libre } from "@/components/fonts/font-def";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Database } from "@/database.types";
import DateFormatter from "@/lib/date-formatter";
import { cn, formatPrice } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { ArrowRight, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ProductCardListProps =
  Database["public"]["Tables"]["wedding_products"]["Row"] & {
    variant: Database["public"]["Tables"]["products_variant_options"]["Row"] & {
      variantGroup: Database["public"]["Tables"]["products_variants"]["Row"];
    };
    product: Database["public"]["Tables"]["products"]["Row"] & {
      brand: Database["public"]["Tables"]["catalog_brands"]["Row"];
    };
    user: Database["public"]["Tables"]["users"]["Row"];
    wedding: Database["public"]["Tables"]["weddings"]["Row"];
  };

export const ProductCardList = async ({
  data,
  user,
}: {
  data: ProductCardListProps;
  user: User;
}) => {
  return (
    <div className="flex-1 items-start justify-start flex-col gap-0 border bg-background group">
      <div className="w-full flex-1 h-fit md:h-full items-start justify-start flex flex-row md:flex-col p-3 pb-0 md:p-0">
        <div className="aspect-[3/4] relative w-full max-w-[180px] md:max-w-none shrink-0 h-auto">
          <div className="absolute size-fit right-2 top-2 z-[11]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="rounded-none size-6 shadow-sm">
                  <AvatarFallback className="rounded-none text-xs bg-primary text-primary-foreground cursor-default">
                    {data.user.first_name[0] + data.user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Agregado por{" "}
                  {data.user.first_name + " " + data.user.last_name} el día{" "}
                  <DateFormatter
                    format="d 'de' MMMM 'de' yyyy, h:mm a"
                    date={data.created_at}
                  />
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          {data.auto_purchase && (
            <span className="flex absolute top-2 left-2 z-[11] bg-foreground size-6 items-center justify-center">
              <StarIcon className="size-4 text-transparent fill-white" />
            </span>
          )}
          <div className="absolute inset-0 overflow-hidden bg-background">
            {data.variant.images_url && data.variant.images_url.length > 0 ? (
              <>
                <Image
                  alt={data.product.short_name}
                  fill
                  className="object-cover group-hover:opacity-0 opacity-100 ease-in-out duration-300"
                  src={data.product.images_url[0]}
                />
                <Image
                  alt={data.product.short_name}
                  fill
                  className="object-cover group-hover:opacity-100 opacity-0 ease-in-out duration-300"
                  src={data.variant.images_url[0]}
                />
              </>
            ) : (
              <Image
                src={data.product.images_url[0]}
                alt={data.product.short_name}
                fill
                className="object-cover"
                quality={100}
              />
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between w-full gap-y-0.5 p-3">
          <span className="w-full items-start justify-start flex flex-col gap-y-0.5 mb-5 flex-1">
            <span className="w-full h-fit items-center justify-between flex gap-2 mb-2">
              <p className="text-sm leading-none">
                <span className={cn("opacity-100 uppercase", libre.className)}>
                  {data.product.brand.name}
                </span>
              </p>
            </span>
            <p className="text-base font-semibold tracking-wide line-clamp-2">
              {data.product.short_name}
            </p>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {data.product.short_description}
            </p>
            <p className="text-foreground text-sm line-clamp-3 pt-2">
              {data.variant.variantGroup.name}: {data.variant.name}
            </p>
          </span>
          <div className="w-full h-fit items-start justify-start flex-col hidden md:flex">
            {(data.current_amount >= data.variant.price! && (
              <span className="w-full h-fit items-center justify-start flex flex-col gap-y-2">
                <span className="w-full h-fit items-center justify-between flex font-medium text-base">
                  MXN {formatPrice(data.variant.price!)}
                </span>
                <span className="w-full h-fit items-center justify-between flex text-sm text-muted-foreground">
                  Producto completado
                </span>
              </span>
            )) || (
              <span className="w-full h-fit items-center justify-start flex flex-col gap-y-2">
                <span className="w-full h-fit items-center justify-between flex font-medium text-base">
                  {formatPrice(data.current_amount)} de MXN{" "}
                  {formatPrice(data.variant.price!)}
                </span>
                <Progress
                  className="h-3"
                  value={(data.current_amount / data.variant.price!) * 100}
                  max={data.variant.price!}
                />
              </span>
            )}
          </div>
          {(data.current_amount >= data.variant.price! && (
            <span className="w-full h-fit items-center justify-start flex flex-col gap-y-2 md:hidden">
              <span className="w-full h-fit items-center justify-between flex font-medium text-base">
                MXN {formatPrice(data.variant.price!)}
              </span>
              <span className="w-full h-fit items-center justify-between flex text-sm text-muted-foreground">
                Producto completado
              </span>
            </span>
          )) || (
            <span className="w-full h-fit items-center justify-start flex flex-col gap-y-2 md:hidden">
              <span className="w-full h-fit items-center justify-between flex font-medium text-base">
                {formatPrice(data.current_amount)} de MXN{" "}
                {formatPrice(data.variant.price!)}
              </span>
            </span>
          )}
        </div>
      </div>
      <div className="w-full h-fit items-start justify-start flex-col flex md:hidden p-3">
        {(data.is_ordered && (
          <span className="w-full h-fit items-center justify-start flex flex-col gap-y-2">
            <span className="w-full h-fit items-center justify-between font-medium text-base hidden md:flex">
              MXN {formatPrice(data.variant.price!)}
            </span>
            <span className="w-full h-fit items-center justify-between text-sm text-muted-foreground hidden md:flex">
              Este producto ya fue comprado, puedes ver los detalles de la
              orden.
            </span>
            <Separator />
            <div className="flex items-center justify-between gap-x-2 w-full">
              <Button
                asChild
                className="flex-1"
                variant={"secondary"}
                size={"sm"}
              >
                <Link
                  href={`/dashboard/${data.wedding_id}/orders/${data.order_id}`}
                >
                  Ver orden <ArrowRight />
                </Link>
              </Button>
            </div>
          </span>
        )) ||
          (data.current_amount >= data.variant.price! && (
            <span className="w-full h-fit items-center justify-start hidden md:flex flex-col gap-y-2">
              <span className="w-full h-fit items-center justify-between flex font-medium text-base">
                MXN {formatPrice(data.variant.price!)}
              </span>
              <span className="w-full h-fit items-center justify-between hidden md:flex text-sm text-muted-foreground">
                Producto completado
              </span>
            </span>
          )) || (
            <span className="w-full h-fit items-center justify-start flex flex-col gap-y-2">
              <span className="w-full h-fit items-center justify-between  hidden md:flex font-medium text-base">
                {formatPrice(data.current_amount)} de MXN{" "}
                {formatPrice(data.variant.price!)}
              </span>
              <Progress
                className="h-3"
                value={(data.current_amount / data.variant.price!) * 100}
                max={data.variant.price!}
              />
            </span>
          )}
      </div>
    </div>
  );
};
