"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import Link from "next/link";

// Define the Order type based on your database structure
export type Order = {
  id: string;
  status: string;
  created_at: string;
  verified_at: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  canceled_at: string | null;
  provider_business_id: string;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    state: string;
  };
  client: {
    first_name: string;
    last_name: string;
  };
  product: {
    id: string;
    variant: {
      variant_list: {
        id: string;
      };
    };
    product_info: {
      brand: {
        id: string;
      };
      subcategory: {
        id: string;
      };
    };
  };
  provider_user: any;
  provider_shipped_user: any;
};

interface OrdersTableProps {
  orders: Order[];
  totalCount: number;
  pageSize?: number;
  currentPage?: number;
}

export function OrdersTable({
  orders,
  totalCount,
  pageSize = 10,
  currentPage = 1,
}: OrdersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Group orders by status
  const groupedOrders = orders.reduce((acc: Record<string, Order[]>, order) => {
    const status = order.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(order);
    return acc;
  }, {});

  // Define status order for display
  const statusOrder = [
    "requires_confirmation",
    "pending",
    "paid",
    "shipped",
    "delivered",
    "canceled",
  ];

  // Create a new query string with updated parameters
  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    return newSearchParams.toString();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    router.push(
      `${pathname}?${createQueryString({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })}`
    );
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "requires_confirmation":
        return <Circle className="size-2 text-contrast fill-contrast" />;
      case "pending":
        return <Circle className="size-2 text-primary fill-primary" />;
      case "paid":
        return <Circle className="size-2 text-contrast2 fill-contrast2" />;
      case "shipped":
        return <Circle className="size-2 text-tertiary fill-tertiary" />;
      case "delivered":
        return <Circle className="size-2 text-success fill-success" />;
      case "canceled":
        return <Circle className="size-2 text-destructive fill-destructive" />;
      default:
        return null;
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "requires_confirmation":
        return "Requieren confirmación";
      case "pending":
        return "Pendientes";
      case "paid":
        return "Listas para envío";
      case "shipped":
        return "En tránsito";
      case "delivered":
        return "Entregadas";
      case "canceled":
        return "Canceladas";
      default:
        return "Desconocido";
    }
  };

  // Get date label based on status
  const getDateLabel = (status: string) => {
    switch (status) {
      case "requires_confirmation":
        return "Fecha creación";
      case "pending":
        return "Fecha confirmación";
      case "paid":
        return "Fecha de pago";
      case "shipped":
        return "Fecha envío";
      case "delivered":
        return "Fecha entrega";
      case "canceled":
        return "Fecha cancelación";
      default:
        return "Fecha";
    }
  };

  // Get the appropriate date based on status
  const getStatusDate = (order: Order) => {
    switch (order.status) {
      case "requires_confirmation":
        return order.created_at;
      case "pending":
        return order.verified_at || order.created_at;
      case "paid":
        return order.paid_at || order.created_at;
      case "shipped":
        return order.shipped_at || order.created_at;
      case "delivered":
        return order.delivered_at || order.created_at;
      case "canceled":
        return order.canceled_at || order.created_at;
      default:
        return order.created_at;
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "requires_confirmation":
        return "bg-contrast/20 text-contrast hover:bg-contrast/10";
      case "pending":
        return "bg-primary/20 text-amber-800 hover:bg-primary/10";
      case "paid":
        return "bg-contrast2/20 text-contrast2 hover:bg-contrast2/10";
      case "shipped":
        return "bg-tertiary/20 text-tertiary border hover:bg-tertiary/10 hover:text-tertiary";
      case "delivered":
        return "bg-success/20 text-success hover:bg-success/10";
      case "canceled":
        return "bg-destructive/20 text-destructive hover:bg-destructive/10";
      default:
        return "bg-background text-muted-foreground hover:bg-background border-border";
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      {/* Render each status group */}
      {statusOrder.map((status) => {
        const statusOrders = groupedOrders[status] || [];
        if (statusOrders.length === 0) return null;

        // Define column headers with dynamic date label based on status
        const columnHeaders = [
          { id: "id", label: "ID", size: 42, maxSize: 42, minSize: 42 },
          {
            id: "status",
            label: "Estado",
            size: 150,
            maxSize: 150,
            minSize: 150,
          },
          {
            id: "date",
            label: getDateLabel(status),
            size: 140,
            maxSize: 140,
            minSize: 140,
          },
          {
            id: "client",
            label: "Cliente",
            size: 150,
            maxSize: 200,
            minSize: 100,
          },
          {
            id: "address",
            label: "Dirección de envío",
            size: 200,
            maxSize: 250,
            minSize: 150,
          },
        ];

        return (
          <Card key={status} className="w-full">
            <Collapsible
              defaultOpen={status !== "delivered" && status !== "canceled"}
              className="group/collapsible data-[state=closed]:mb-2 data-[state=closed]:lg:mb-2 mb-5 lg:mb-7"
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer border-b-0 space-y-0 hover:bg-sidebar">
                  <h3 className="font-medium leading-none tracking-tight flex items-center gap-x-2">
                    {getStatusIcon(status)} {getStatusText(status)}
                  </h3>
                  <span className="flex gap-x-2 items-center justify-end">
                    <p className="text-muted-foreground text-sm">
                      {statusOrders.length > 1
                        ? `${statusOrders.length} órdenes`
                        : `${statusOrders.length} orden`}
                    </p>
                    <ChevronDown className="ml-auto size-4 transition-transform duration-300 ease-in-out flex group-data-[state=open]/collapsible:-rotate-90" />
                  </span>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full bg-background border border-x-0 overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <CardContent className="p-0">
                  <div className="overflow-hidden w-full">
                    <div className="overflow-x-auto no-scrollbar">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            {columnHeaders.map((col) => (
                              <TableHead
                                key={col.id}
                                style={{
                                  width: col.size,
                                  maxWidth: col.maxSize,
                                  minWidth: col.minSize,
                                }}
                                className="whitespace-nowrap font-medium"
                              >
                                {col.label}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {statusOrders.length > 0 ? (
                            statusOrders.map((order) => (
                              <TableRow
                                key={order.id}
                                className="whitespace-nowrap group relative"
                              >
                                {/* ID column */}
                                <TableCell
                                  style={{
                                    width: 42,
                                    maxWidth: 42,
                                    minWidth: 42,
                                  }}
                                  className="group-hover:bg-muted/50"
                                >
                                  {order.id}
                                </TableCell>

                                {/* Status column */}
                                <TableCell
                                  style={{
                                    width: 150,
                                    maxWidth: 150,
                                    minWidth: 150,
                                  }}
                                  className="group-hover:bg-muted/50"
                                >
                                  <Badge
                                    className={cn(
                                      getStatusBadgeClass(order.status)
                                    )}
                                  >
                                    {order.status === "requires_confirmation" &&
                                      "Requiere confirmación"}
                                    {order.status === "pending" && "Pendiente"}
                                    {order.status === "paid" &&
                                      "Lista para envío"}
                                    {order.status === "delivered" &&
                                      "Entregado"}
                                    {order.status === "shipped" &&
                                      "En tránsito"}
                                    {order.status === "canceled" && "Cancelado"}
                                  </Badge>
                                </TableCell>

                                {/* Dynamic date column based on status */}
                                <TableCell
                                  style={{
                                    width: 140,
                                    maxWidth: 140,
                                    minWidth: 140,
                                  }}
                                  className="group-hover:bg-muted/50"
                                >
                                  {getStatusDate(order)
                                    ? formatInTimeZone(
                                        getStatusDate(order),
                                        timeZone,
                                        "PP h:mm a",
                                        { locale: es }
                                      )
                                    : "No disponible"}
                                </TableCell>

                                {/* Client column */}
                                <TableCell
                                  style={{
                                    width: 150,
                                    maxWidth: 200,
                                    minWidth: 100,
                                  }}
                                  className="group-hover:bg-muted/50"
                                >
                                  <p className="truncate">
                                    {order.client.first_name}{" "}
                                    {order.client.last_name}
                                  </p>
                                </TableCell>

                                {/* Address column */}
                                <TableCell
                                  style={{
                                    width: 200,
                                    maxWidth: 250,
                                    minWidth: 150,
                                  }}
                                  className="group-hover:bg-muted/50"
                                >
                                  <p className="truncate">
                                    {order.address.street_address},{" "}
                                    {order.address.city},{" "}
                                    {order.address.postal_code},{" "}
                                    {order.address.state}
                                  </p>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={columnHeaders.length}
                                className="h-24 text-center"
                              >
                                No se encontraron resultados.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Mostrando {Math.min(totalCount, (currentPage - 1) * pageSize + 1)} a{" "}
            {Math.min(currentPage * pageSize, totalCount)} de {totalCount}{" "}
            registros
          </div>

          <Pagination className="order-1 sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* First page always visible */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis after first page if needed */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Pages around current page */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;

                // Show only pages near the current one
                if (
                  pageNumber !== 1 &&
                  pageNumber !== totalPages &&
                  ((pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1) ||
                    (currentPage === 1 && pageNumber <= 3) ||
                    (currentPage === totalPages &&
                      pageNumber >= totalPages - 2))
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {/* Ellipsis before last page if needed */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page always visible (if there's more than one page) */}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(totalPages);
                    }}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
