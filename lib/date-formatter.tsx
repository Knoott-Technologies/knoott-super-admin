"use client";

import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

interface DateFormatterProps {
  date: string | Date;
  className?: string;
  format?: string;
}

/**
 * Componente de cliente para formatear fechas usando la zona horaria del navegador
 * Utiliza específicamente formatInTimeZone para mantener consistencia
 */
export default function DateFormatter({
  date,
  className,
  format = "d 'de' MMMM 'de' yyyy 'a las' h:mm a",
}: DateFormatterProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [timeZone, setTimeZone] = useState<string>("America/Mexico_City"); // Valor por defecto

  useEffect(() => {
    try {
      // Obtener la zona horaria del navegador
      const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimeZone(clientTimeZone);
    } catch (error) {
      console.error("Error al detectar zona horaria:", error);
    }
  }, []);

  useEffect(() => {
    try {
      // Convertir la fecha a objeto Date si es un string
      const dateObj = typeof date === "string" ? new Date(date) : date;

      // Formatear la fecha según la zona horaria detectada
      const formatted = formatInTimeZone(dateObj, timeZone, format, {
        locale: es,
      });

      setFormattedDate(formatted);
    } catch (error) {
      console.error("Error al formatear la fecha:", error);

      // Fallback en caso de error
      const dateObj = typeof date === "string" ? new Date(date) : date;
      setFormattedDate(dateObj.toLocaleDateString("es-ES"));
    }
  }, [date, timeZone, format]);

  return <span className={className}>{formattedDate}</span>;
}
