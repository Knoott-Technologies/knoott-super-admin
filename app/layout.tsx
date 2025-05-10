import type { Metadata, Viewport } from "next";
import "./globals.css";
import { source } from "@/components/fonts/font-def";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertOctagon,
  CheckCheck,
  Info,
  Loader2,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    template: "%s | Knoott Super Admin",
    default: "Knoott Super Admin",
  },
  description: "Ingresa a la plataforma de Knoott Super Admin.",
};

export const viewport: Viewport = {
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={cn(
          "antialiased text-pretty selection:text-[#886F2E] selection:bg-primary/20",
          source.className
        )}
      >
        <NuqsAdapter>
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster
              position="top-right"
              containerAriaLabel="Notificaciones"
              className="z-[999]"
              theme="light"
              richColors
              toastOptions={{
                unstyled: false,
                classNames: {
                  toast: "!rounded-none bg-background !shadow-lg !border-0",
                  content: "!rounded-none",
                  default: "!rounded-none shadow-lg border-0",
                  title: cn("!font-semibold !text-foreground"),
                  description:
                    "!text-muted-foreground !text-[13px] !font-medium !tracking-tight",
                },
              }}
              icons={{
                warning: <TriangleAlert className="size-4" />,
                error: <AlertOctagon className="size-4" />,
                success: <CheckCheck className="size-4 !text-success" />,
                close: <X className="size-4" />,
                info: <Info className="size-4" />,
                loading: <Loader2 className="size-4 animate-spin" />,
              }}
            />
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
