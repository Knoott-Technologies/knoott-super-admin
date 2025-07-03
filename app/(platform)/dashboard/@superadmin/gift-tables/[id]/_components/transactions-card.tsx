"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Database } from "@/database.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, formatPrice } from "@/lib/utils";
import {
    eachDayOfInterval,
    endOfWeek,
    format,
    isWithinInterval,
    startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDown, ArrowUp, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type TransactionRow =
  Database["public"]["Tables"]["wedding_transactions"]["Row"];

const chartConfig = {
  income: {
    label: "Ingresos",
    color: "hsl(var(--success))",
    icon: ArrowUp,
  },
  egress: {
    label: "Egresos",
    color: "hsl(var(--destructive))",
    icon: ArrowDown,
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-lg shadow-sm flex flex-col gap-y-1.5">
        <p className="text-base font-medium pb-0.5 border-b">{`${label}`}</p>
        <span className="flex flex-col gap-y-0 items-start justify-start">
          {payload.map((entry: any, index: number) => {
            return (
              <span
                key={index}
                className={cn(
                  "text-sm text-muted-foreground flex items-center justify-start gap-1"
                )}
              >
                <div
                  className="size-3 aspect-square shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <p>
                  {entry.name}:{" "}
                  <span className="text-foreground font-medium">
                    MXN {formatPrice(entry.value)}
                  </span>
                </p>
              </span>
            );
          })}
        </span>
      </div>
    );
  }
  return null;
};

// Función para procesar los datos para el gráfico, incluyendo fechas sin datos
const processDataForChart = (
  data: TransactionRow[] | null,
  dateRange: DateRange | undefined
) => {
  if (!data || !dateRange?.from || !dateRange?.to) return [];

  // Crear un arreglo con todas las fechas en el rango seleccionado
  const allDatesInRange = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  });

  // Crear un objeto con todas las fechas inicializadas en cero
  const allDatesData: Record<
    string,
    { date: string; income: number; egress: number }
  > = {};

  allDatesInRange.forEach((date) => {
    const formattedDate = format(date, "dd MMM", { locale: es });

    allDatesData[formattedDate] = {
      date: formattedDate,
      income: 0,
      egress: 0,
    };
  });

  // Filtrar transacciones por el rango de fechas
  const filteredData = data.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at);
    return isWithinInterval(transactionDate, {
      start: dateRange.from!,
      end: dateRange.to!,
    });
  });

  // Agregar los datos de transacciones a las fechas correspondientes
  filteredData.forEach((transaction) => {
    const date = new Date(transaction.created_at);
    const formattedDate = format(date, "dd MMM", { locale: es });

    if (transaction.type === "income") {
      allDatesData[formattedDate].income += Number(transaction.user_received_amount);
    } else if (
      transaction.type === "egress" ||
      transaction.type === "purchase"
    ) {
      allDatesData[formattedDate].egress += Number(transaction.user_received_amount);
    }
  });

  // Convertir a array y ordenar por fecha
  const sortedData = Object.values(allDatesData);

  // Ordenar por fecha original (no por el formato de visualización)
  return sortedData.sort((a, b) => {
    const datePartsA = a.date.split(" ");
    const datePartsB = b.date.split(" ");

    if (datePartsA.length < 2 || datePartsB.length < 2) {
      return 0; // Si no podemos analizar, dejamos el orden igual
    }

    const dayA = parseInt(datePartsA[0]);
    const dayB = parseInt(datePartsB[0]);

    const monthA = datePartsA[1].toLowerCase();
    const monthB = datePartsB[1].toLowerCase();

    // Lista de meses en español abreviados
    const monthsOrder = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];

    const monthIndexA = monthsOrder.findIndex((m) => monthA.startsWith(m));
    const monthIndexB = monthsOrder.findIndex((m) => monthB.startsWith(m));

    // Si los meses son diferentes, ordenar por mes
    if (monthIndexA !== monthIndexB) {
      return monthIndexA - monthIndexB;
    }

    // Si los meses son iguales, ordenar por día
    return dayA - dayB;
  });
};

// Gráfico unificado para móvil y escritorio
const ChartComponent = ({
  data,
  isMobile,
}: {
  data: any[];
  isMobile: boolean;
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={data}
      margin={{
        top: 20,
        right: 10,
        left: 0,
        bottom: isMobile ? 20 : 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
      <XAxis
        dataKey="date"
        tick={{ fontSize: isMobile ? 10 : 12 }}
        tickLine={false}
        axisLine={false}
        angle={isMobile ? -90 : 0}
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
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey="income"
        name="Ingresos"
        stroke={chartConfig.income.color}
        strokeWidth={1}
        strokeOpacity={0.3}
        fill={chartConfig.income.color}
        fillOpacity={0.1}
        dot={{ r: 3, fillOpacity: 0.5 }}
      />
      <Area
        type="monotone"
        dataKey="egress"
        name="Egresos"
        stroke={chartConfig.egress.color}
        strokeWidth={1}
        strokeOpacity={0.3}
        fill={chartConfig.egress.color}
        fillOpacity={0.1}
        dot={{ r: 3 }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const TransactionChart = ({
  data,
}: {
  data: Database["public"]["Tables"]["wedding_transactions"]["Row"][] | null;
}) => {
  // Usamos el hook useIsMobile
  const isMobile = useIsMobile();

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { locale: es }),
    to: endOfWeek(new Date(), { locale: es }),
  });

  // Procesamos los datos según el rango de fechas seleccionado
  // incluyendo fechas sin transacciones
  const chartData = processDataForChart(data, date);

  return (
    <Card className="bg-sidebar shadow-none rounded-none border w-full">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Línea del tiempo</CardTitle>
            <CardDescription className="text-gray-500">
              Echa un vistazo a todos los movimientos de tu mesa de regalos.
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "shrink-0 bg-sidebar w-fit",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd/MM/yy", { locale: es })} -{" "}
                      {format(date.to, "dd/MM/yy", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "dd/MM/yy", { locale: es })
                  )
                ) : (
                  <span>Selecciona un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={isMobile ? 1 : 2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div
          className={cn(
            "w-full",
            isMobile ? "h-[400px]" : "aspect-video lg:aspect-[16/6]"
          )}
        >
          <ChartComponent data={chartData} isMobile={isMobile} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
