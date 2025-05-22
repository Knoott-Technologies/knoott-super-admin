"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/database.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, formatPrice } from "@/lib/utils";
import {
  endOfWeek,
  format,
  isWithinInterval,
  parse,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDown, ArrowUp, Loader2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TransactionRow =
  Database["public"]["Views"]["z_knoott_transactions"]["Row"];

const chartConfig = {
  income: {
    label: "Ingresos",
    color: "hsl(var(--success))",
    icon: ArrowUp,
  },
  outcome: {
    label: "Egresos",
    color: "hsl(var(--destructive))",
    icon: ArrowDown,
  },
  pending: {
    label: "En proceso",
    color: "hsl(var(--primary))",
    icon: Loader2,
  },
  canceled: {
    label: "Canceladas",
    color: "hsl(var(--destructive))",
    icon: X,
  },
} satisfies ChartConfig;

// Función para procesar los datos para el gráfico, incluyendo fechas sin datos
const processDataForChart = (
  data: TransactionRow[] | null,
  dateRange: DateRange | undefined,
  transactionType: string | null
) => {
  // Si no hay datos o rango de fechas, retornar array vacío
  if (!data || !dateRange?.from || !dateRange?.to) return [];

  // Filtrar transacciones por el rango de fechas seleccionado
  return data.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at!);
    const isInDateRange = isWithinInterval(transactionDate, {
      start: dateRange.from!,
      end: dateRange.to!,
    });

    // Si hay un tipo de transacción seleccionado, filtrar por ese tipo
    if (transactionType && transactionType !== "all") {
      return isInDateRange && transaction.type === transactionType;
    }

    return isInDateRange;
  });
};

// Función para agrupar datos por fecha y tipo, incluyendo todas las fechas del rango
const groupDataByDateAndType = (
  data: TransactionRow[],
  dateRange: DateRange | undefined
) => {
  const dateMap = new Map();

  // Si no hay rango de fechas, retornar array vacío
  if (!dateRange?.from || !dateRange?.to) return [];

  // Crear un array con todas las fechas del rango
  const allDates = [];
  const currentDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);

  // Asegurarse que currentDate y endDate estén en la misma zona horaria
  currentDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // Crear entradas para todas las fechas en el rango
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    dateMap.set(dateStr, {
      date: dateStr,
      displayDate: format(currentDate, "PP", { locale: es }),
      income: 0,
      outcome: 0,
    });

    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Procesar cada transacción
  data.forEach((tx) => {
    const date = format(new Date(tx.created_at!), "yyyy-MM-dd");
    // Solo procesar si la fecha está en nuestro mapa (dentro del rango)
    if (dateMap.has(date)) {
      // Sumar el monto según el tipo
      const type = tx.type;
      if (type && (type === "income" || type === "outcome")) {
        dateMap.get(date)[type] += tx.amount || 0;
      }
    }
  });

  // Convertir el mapa a un array ordenado por fecha
  return Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// Función para agrupar datos por estado y tipo
const groupDataByStatusAndType = (data: TransactionRow[]) => {
  const incomeData = data.filter((tx) => tx.type === "income");
  const outcomeData = data.filter((tx) => tx.type === "outcome");

  return {
    income: {
      completed: incomeData.filter((tx) => tx.status === "completed"),
      pending: incomeData.filter((tx) => tx.status === "pending"),
      canceled: incomeData.filter((tx) => tx.status === "canceled"),
    },
    outcome: {
      completed: outcomeData.filter((tx) => tx.status === "completed"),
      pending: outcomeData.filter((tx) => tx.status === "pending"),
      canceled: outcomeData.filter((tx) => tx.status === "canceled"),
    },
  };
};

// Gráfico unificado para móvil y escritorio con áreas separadas (no stackeadas)
const ChartComponent = ({
  data,
  isMobile,
  dateRange,
}: {
  data: TransactionRow[];
  isMobile: boolean;
  dateRange: DateRange | undefined;
}) => {
  // Agrupar los datos por fecha y tipo para visualización no stackeada, incluyendo todas las fechas del rango
  const chartData = groupDataByDateAndType(data, dateRange);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart
        data={chartData}
        margin={{
          top: 20,
          right: 10,
          left: 20,
          bottom: isMobile ? 20 : 5,
        }}
        accessibilityLayer
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: isMobile ? 10 : 12 }}
          tickLine={false}
          axisLine={false}
          angle={isMobile ? -45 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          textRendering={"optimized"}
        />
        {!isMobile && (
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatPrice(value)}
            tickLine={false}
            axisLine={false}
          />
        )}
        <Tooltip
          content={
            <ChartTooltipContent
              className="rounded-none"
              labelClassName="font-semibold text-foreground text-sm border-b pb-1.5 mb-1.5"
              formatter={(value, name, item, index) => {
                return (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 bg-[--color-bg]"
                      style={
                        {
                          "--color-bg": `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    />
                    {chartConfig[name as keyof typeof chartConfig]?.label}
                    <div className="ml-auto flex items-baseline gap-0.5 font-semibold text-foreground">
                      MXN {formatPrice(Number.parseFloat(value as string))}
                    </div>
                    {index === 1 && (
                      <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                        Balance
                        <div className="ml-auto flex items-baseline gap-0.5 font-semibold">
                          MXN{" "}
                          {formatPrice(
                            item.payload.income - item.payload.outcome
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              }}
            />
          }
          defaultIndex={1}
          cursor={false}
        />
        <Area
          type="monotone"
          dataKey="income"
          name="income"
          stroke={"var(--color-income)"}
          strokeWidth={2}
          strokeOpacity={0.3}
          fill={"var(--color-income)"}
          fillOpacity={0.1}
          dot={{ r: 2, fillOpacity: 0.5 }}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="outcome"
          name="outcome"
          stroke={"var(--color-outcome)"}
          strokeWidth={2}
          strokeOpacity={0.3}
          fill={"var(--color-outcome)"}
          fillOpacity={0.1}
          dot={{ r: 2, fillOpacity: 0.5 }}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export const TransactionChartDashboard = ({
  data,
}: {
  data: Database["public"]["Views"]["z_knoott_transactions"]["Row"][] | null;
}) => {
  // Usamos el hook useIsMobile
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  // Estado para almacenar el rango de fechas actual
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  // Estado para almacenar el tipo de transacción seleccionado
  const [transactionType, setTransactionType] = useState<string>("all");

  useEffect(() => {
    // Obtener parámetros de fecha de la URL
    const fromParam = searchParams.get("fromDate");
    const toParam = searchParams.get("toDate");
    const typeParam = searchParams.get("type");

    if (fromParam && toParam) {
      try {
        const from = parse(fromParam, "yyyy-MM-dd", new Date());
        const to = parse(toParam, "yyyy-MM-dd", new Date());
        setDateRange({ from, to });
      } catch (error) {
        console.error("Error parsing dates from URL", error);
        // Usar la semana actual como valor predeterminado
        setDateRange({
          from: startOfWeek(new Date(), { locale: es }),
          to: endOfWeek(new Date(), { locale: es }),
        });
      }
    } else {
      // Usar la semana actual como valor predeterminado si no hay parámetros
      setDateRange({
        from: startOfWeek(new Date(), { locale: es }),
        to: endOfWeek(new Date(), { locale: es }),
      });
    }

    // Establecer el tipo de transacción si está en la URL
    if (typeParam) {
      setTransactionType(typeParam);
    }
  }, [searchParams]);

  // Procesar los datos para el gráfico según el rango de fechas y tipo de transacción
  const chartData = processDataForChart(
    data,
    dateRange,
    transactionType === "all" ? null : transactionType
  );

  // Calcular totales para mostrar en la tarjeta
  const totalIncome = chartData
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const totalOutcome = chartData
    .filter((tx) => tx.type === "outcome")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const handleTabChange = (value: string) => {
    setTransactionType(value);
  };

  return (
    <Card className="bg-sidebar shadow-none rounded-none border w-full">
      <CardHeader>
        <CardTitle>Transacciones</CardTitle>
        <CardDescription className="text-gray-500">
          Echa un vistazo a tus transacciones
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div
          className={cn(
            "w-full",
            isMobile ? "h-[400px]" : "aspect-video lg:aspect-[16/6]"
          )}
        >
          <ChartComponent
            data={chartData}
            isMobile={isMobile}
            dateRange={dateRange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChartDashboard;
