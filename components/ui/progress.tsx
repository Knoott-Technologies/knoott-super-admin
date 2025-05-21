"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden bg-foreground/10",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-foreground transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

interface ProgressContributionProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  contribution?: number;
  indicatorClassName?: string;
  contributionClassName?: string;
}

const ProgressContribution = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressContributionProps
>(
  (
    {
      className,
      value,
      contribution = 0,
      indicatorClassName,
      contributionClassName,
      ...props
    },
    ref
  ) => {
    // Asegurar que value y contribution son números entre 0 y 100
    const safeValue = Math.max(0, Math.min(100, value || 0));
    const safeContribution = Math.max(0, Math.min(100, contribution || 0));

    // Limitar la contribución para que no exceda 100 cuando se suma con el valor
    const limitedContribution = Math.min(safeContribution, 100 - safeValue);

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden bg-foreground/10",
          className
        )}
        {...props}
      >
        {/* Indicador principal (valor actual) */}
        <div
          className={cn(
            "h-full absolute left-0 top-0 bg-foreground transition-all",
            indicatorClassName
          )}
          style={{ width: `${safeValue}%` }}
        />

        {/* Indicador de contribución (después del valor principal) */}
        {limitedContribution > 0 && (
          <div
            className={cn(
              "h-full absolute top-0 transition-all",
              contributionClassName
            )}
            style={{
              left: `${safeValue}%`,
              width: `${limitedContribution}%`,
            }}
          />
        )}
      </ProgressPrimitive.Root>
    );
  }
);
ProgressContribution.displayName = "ProgressContribution";

export { Progress, ProgressContribution };
