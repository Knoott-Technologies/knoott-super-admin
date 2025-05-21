"use client";

import React from "react";
import { Contribution } from "../page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/database.types";
import { CartItemSummary } from "@/components/common/cards/contribution-summary";

interface CartItemMetadata {
  image_url: string;
  name: string;
  [key: string]: any; // Para otros campos que puedan existir
}

export interface CartItem
  extends Omit<Database["public"]["Tables"]["cart_items"]["Row"], "metadata"> {
  metadata: CartItemMetadata;
}

export const ContributionProducts = ({
  contribution,
}: {
  contribution: Contribution;
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Items dentro de la contribución</CardTitle>
        <CardDescription>
          Estos son los items dentro del carrito del usuario al momento de
          realizar la contribución.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-y-4 bg-sidebar flex flex-col">
        {contribution.cart.message && (
          <span className="w-full h-fit items-start justify-start flex flex-col gap-y-2">
            <p className="text-sm text-foreground font-semibold">Mensaje:</p>
            <p className="text-muted-foreground text-sm">{contribution.cart.message}</p>
          </span>
        )}

        {contribution.cart.cart_items.length > 0 ? (
          <span className="w-full h-fit items-start justify-start flex flex-col gap-y-2">
            <p className="text-sm text-foreground font-semibold">Artículos:</p>
            <div className="w-full h-fit items-start justify-start flex bg-sidebar border flex-col gap-y-0">
              {contribution.cart.cart_items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CartItemSummary sm key={item.id} data={item as CartItem} />
                  {index < contribution.cart.cart_items.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
};
