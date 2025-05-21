"use client";

import { Transaction } from "@/app/(platform)/dashboard/@superadmin/gift-tables/[id]/_components/contribution-columns";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";

export const ContributionMessage = ({
  data,
}: {
  data: Pick<Transaction, "cart" | "user">;
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    if (!data.cart!.message) {
      return <p>Sin Mensaje</p>;
    }

    return (
      <Sheet>
        <SheetTrigger asChild>
          <div className="truncate max-w-md cursor-pointer">
            {data.cart!.message}
          </div>
        </SheetTrigger>
        <SheetContent side={"bottom"} className="max-h-[80dvh] p-0">
          <SheetHeader className="bg-sidebar border-b p-3 text-start">
            <SheetTitle>
              Mensaje de {data.user.first_name + " " + data.user.last_name}
            </SheetTitle>
          </SheetHeader>
          <div className="p-3 w-full">
            <p className="text-muted-foreground">{data.cart!.message}</p>
          </div>
          <SheetFooter className="bg-sidebar border-t p-3 pb-8 md:pb-3">
            <SheetClose asChild>
              <Button
                variant={"defaultBlack"}
                size={"default"}
                className="w-full"
              >
                Cerrar <X />
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  if (!data.cart.message) {
    return <p>Sin Mensaje</p>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="truncate max-w-md">{data.cart!.message}</div>
      </TooltipTrigger>
      <TooltipContent className="w-[--radix-tooltip-trigger-width] px-0 pb-0">
        <div className="flex-1 items-start justify-start flex flex-col gap-y-0 w-full">
          <span className="bg-sidebar border-b px-3 py-1.5 w-full">
            <p className="text-sm text-foreground font-semibold">
              Mensaje de {data.user.first_name + " " + data.user.last_name}
            </p>
          </span>
          <span className=" px-3 py-1.5 bg-background">
            <p className="text-sm text-muted-foreground">
              {data.cart!.message}
            </p>
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
