import { libre } from "@/components/fonts/font-def";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Database } from "@/database.types";
import DateFormatter from "@/lib/date-formatter";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Icon } from "../logo";

export const GiftCardCard = ({
  data,
  weddingId,
}: {
  data: Database["public"]["Tables"]["gift_cards"]["Row"] & {
    user: Database["public"]["Tables"]["users"]["Row"];
  };
  weddingId: string;
}) => {
  return (
    <div className="w-full flex-1 items-start justify-start flex flex-col bg-background p-3 border">
      <div
        className="group relative w-full aspect-[3/4] flex flex-col gap-y-3 p-3 border transition-all rounded-[5px] duration-300 text-white"
        style={{
          backgroundColor: data.bg_color || "#f8fafc",
          position: "relative",
        }}
      >
        <span className="bg-gradient-to-b from-black/60 to-black/20 absolute inset-0 z-10" />

        <div className="absolute size-fit -bottom-1 -left-1 z-[11]">
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
                Agregado por {data.user.first_name + " " + data.user.last_name}{" "}
                el día{" "}
                <DateFormatter
                  format="d 'de' MMMM 'de' yyyy, h:mm a"
                  date={data.created_at}
                />
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        {data.bg_image_url && (
          <div className="absolute inset-0 overflow-hidden rounded-[4px]">
            <Image
              src={data.bg_image_url}
              alt={data.title || "Tarjeta de Regalo"}
              className="object-cover"
              fill
              quality={100}
            />
          </div>
        )}

        <div className="items-center justify-between flex inset-x-0 absolute top-0 p-3 z-10">
          <p className="text-base font-semibold max-w-[35%] truncate">
            {formatPrice(data.total_amount)}
          </p>
          <Icon variant={"white"} className="w-[7%] h-auto" />
        </div>

        <div className="inset-x-0 items-center justify-center flex flex-col absolute top-0 py-3 z-10">
          <span className="w-[5%] h-auto aspect-[16/8] bg-sidebar rounded-t-full border border-b-0 translate-y-[1px] shrink-0" />
          <span className="w-[18%] aspect-[16/4] bg-sidebar rounded-full border" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col gap-y-2 items-start justify-start">
          <div className="flex flex-col flex-1 justify-start mt-[15%] w-full">
            <span className="w-full h-fit items-start justify-start">
              <p className="text-sm opacity-100 leading-none mb-2 w-full">
                Knoott{" "}
                <span className="opacity-100 uppercase font-serif">
                  {" "}
                  gift card
                </span>
              </p>
              <h3 className="text-2xl md:text-xl font-semibold w-full line-clamp-3 max-w-full">
                {data.title || "Título de la Tarjeta"}
              </h3>
            </span>
            {data.description && (
              <p className={cn("text-base w-full line-clamp-3 opacity-90")}>
                {data.description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between w-full gap-y-0.5 pt-4">
        <span className="w-full items-start justify-start flex flex-col gap-y-0.5 mb-5 flex-1">
          <p className="text-sm leading-none">
            Knoott
            <span className={cn("opacity-100 uppercase", libre.className)}>
              {" "}
              gift card
            </span>
          </p>
          <p className="text-base font-semibold tracking-wide line-clamp-2">
            {data.title}
          </p>
          <p className="text-muted-foreground line-clamp-2">
            {data.description}
          </p>
        </span>
      </div>
      <span className="w-full h-fit items-center justify-start flex flex-col gap-y-2 mt-auto">
        <span className="w-full h-fit items-center justify-between flex font-medium text-base">
          {formatPrice(data.current_amount)} de MXN{" "}
          {formatPrice(data.total_amount)}{" "}
        </span>
        <Progress
          className="h-3"
          value={(data.current_amount / data.total_amount) * 100}
          max={data.total_amount}
        />
      </span>
    </div>
  );
};