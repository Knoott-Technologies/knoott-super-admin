import { Database } from "@/database.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un valor numérico como precio en formato MXN,
 * donde los dos últimos dígitos representan centavos.
 *
 * Ejemplos:
 * - 10000 => $100.00
 * - 12345 => $123.45
 * - 50 => $0.50
 *
 * @param amount - Valor numérico donde los dos últimos dígitos son centavos
 * @returns Cadena formateada con el precio
 */
export const formatPrice = (amount: number): string => {
  // Dividir por 100 para convertir los últimos dos dígitos a centavos
  const valueWithDecimals = amount / 100;

  // Usar Intl.NumberFormat para formatear con símbolo de moneda y dos decimales fijos
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueWithDecimals);
};

export const getRoleClassNames = (
  role: Database["public"]["Enums"]["admin_role"]
) => {
  switch (role) {
    case "superadmin":
      return "bg-contrast/10 text-contrast";
    case "mod":
      return "bg-contrast2/10 text-contrast2";
    case "marketing":
      return "bg-tertiary/10 text-tertiary";
    case "account_manager":
      return "bg-primary/10 text-amber-600";
  }
};

/**
 * Returns the appropriate class names for a given wedding status.
 *
 * This function maps a wedding status to a set of CSS class names
 * that can be used to style UI elements accordingly.
 *
 * @param status - The wedding status which can be "paused", "active", or "closed".
 * @returns A string containing the CSS class names for the specified status.
 */

export const getGiftTableStatusClassNames = (
  status: Database["public"]["Enums"]["wedding_status"]
) => {
  switch (status) {
    case "paused":
      return "bg-primary/10 text-amber-600";
    case "active":
      return "bg-success/10 text-success";
    case "closed":
      return "bg-destructive/10 text-destructive";
  }
};

export const getGiftTableStatusLabel = (
  status: Database["public"]["Enums"]["wedding_status"]
) => {
  switch (status) {
    case "paused":
      return "Pausada";
    case "active":
      return "Activa";
    case "closed":
      return "Cerrada";
  }
};

export const getProductStatusClassNames = (
  status: Database["public"]["Enums"]["product_status"]
) => {
  switch (status) {
    case "draft":
      return "bg-primary/10 text-amber-600 hover:bg-primary/10 hover:text-amber-600";
    case "active":
      return "bg-success/10 text-success hover:bg-success/10 hover:text-success";
    case "deleted":
      return "bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive";
    case "archived":
      return "bg-contrast2/10 text-contrast2 hover:bg-contrast2/10 hover:text-contrast2";
    case "requires_verification":
      return "bg-contrast/10 text-contrast hover:bg-contrast/10 hover:text-contrast";
  }
};

export const getProductStatusLabel = (
  status: Database["public"]["Enums"]["product_status"]
) => {
  switch (status) {
    case "draft":
      return "Borrador";
    case "active":
      return "Activo";
    case "deleted":
      return "Eliminado";
    case "archived":
      return "Archivado";
    case "requires_verification":
      return "Requiere verificación";
  }
};

/**
 * Función auxiliar para acceder de forma segura a propiedades anidadas
 * @param obj El objeto del que queremos obtener la propiedad
 * @param path La ruta a la propiedad, usando notación de puntos (ej: "user.address.street")
 * @param defaultValue Valor por defecto si la propiedad no existe
 */
export function getNestedValue<T = any>(
  obj: any,
  path: string,
  defaultValue: T
): T {
  if (!obj || !path) return defaultValue;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    // Manejar acceso a arrays con índices, ej: "categories[0]"
    if (key.includes("[") && key.includes("]")) {
      const arrayName = key.substring(0, key.indexOf("["));
      const index = Number.parseInt(
        key.substring(key.indexOf("[") + 1, key.indexOf("]"))
      );

      if (
        !current[arrayName] ||
        !Array.isArray(current[arrayName]) ||
        !current[arrayName][index]
      ) {
        return defaultValue;
      }

      current = current[arrayName][index];
    } else {
      if (current[key] === undefined || current[key] === null) {
        return defaultValue;
      }

      current = current[key];
    }
  }

  return current as T;
}

/**
 * Función para crear un accessor seguro para columnas con propiedades anidadas
 * @param path La ruta a la propiedad
 * @param defaultValue Valor por defecto
 */
export function createSafeAccessor<TData, TValue = string>(
  path: string,
  defaultValue: TValue
) {
  return (row: TData): TValue => {
    return getNestedValue<TValue>(row, path, defaultValue);
  };
}
