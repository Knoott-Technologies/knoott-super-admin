"use client";

import type React from "react";

import type { Column } from "@tanstack/react-table";
import { Check, ChevronsUpDown, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Interfaz para las opciones de filtro que se definirán en la columna
export interface FilterOption {
  label: string;
  value: string | number | boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

// Interfaz para los metadatos de filtro en la columna
export interface ColumnFilterMeta {
  filterOptions?: FilterOption[];
  filterVariant?: "select" | "multi-select" | "range" | "text" | "auto-select";
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  label?: string;
  placeholder?: string;
  range?: [number, number];
  unit?: string;
  // Nueva propiedad para determinar si se deben generar opciones automáticamente
  generateOptionsFromData?: boolean;
}

interface DataTableColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title?: string;
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  title,
}: DataTableColumnFilterProps<TData, TValue>) {
  // Obtener metadatos de la columna
  const columnMeta = column.columnDef.meta as ColumnFilterMeta | undefined;
  const options = columnMeta?.filterOptions || [];
  const variant = columnMeta?.filterVariant || "select";
  const columnTitle = columnMeta?.label || title || column.id;
  const icon = columnMeta?.icon;
  const placeholder =
    columnMeta?.placeholder || `Filtrar por ${columnTitle.toLowerCase()}...`;
  const range = columnMeta?.range;
  const unit = columnMeta?.unit || "";
  const generateOptionsFromData =
    columnMeta?.generateOptionsFromData || variant === "auto-select";
  const isMobile = useIsMobile();

  // Si es un filtro de rango
  if (variant === "range" && range) {
    return (
      <DataTableRangeFilter
        column={column}
        title={columnTitle}
        range={range}
        unit={unit}
        icon={icon}
      />
    );
  }

  // Si es un filtro de texto
  if (variant === "text") {
    return (
      <DataTableTextFilter
        column={column}
        title={columnTitle}
        placeholder={placeholder}
        icon={icon}
      />
    );
  }

  // Si es un filtro automático basado en valores únicos
  if (variant === "auto-select" || generateOptionsFromData) {
    return (
      <DataTableAutoSelectFilter
        column={column}
        title={columnTitle}
        icon={icon}
        predefinedOptions={options}
      />
    );
  }

  // Si no hay opciones para select o multi-select, no mostrar el filtro
  if ((variant === "select" || variant === "multi-select") && !options.length) {
    return null;
  }

  // Para filtros de selección única
  if (variant === "select") {
    return (
      <DataTableSelectFilter
        column={column}
        title={columnTitle}
        options={options}
        icon={icon}
      />
    );
  }

  // Para filtros de selección múltiple
  return (
    <DataTableMultiSelectFilter
      column={column}
      title={columnTitle}
      options={options}
      icon={icon}
    />
  );
}

// Actualizar el componente DataTableAutoSelectFilter para unificar estilos
function DataTableAutoSelectFilter<TData, TValue>({
  column,
  title,
  icon: Icon,
  predefinedOptions = [],
}: {
  column: Column<TData, TValue>;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  predefinedOptions?: FilterOption[];
}) {
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const selectedValue = column.getFilterValue() as string;
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  // Generar opciones de filtro a partir de valores únicos
  const options = useMemo(() => {
    // Si hay opciones predefinidas, usarlas primero
    if (predefinedOptions.length > 0) {
      return predefinedOptions;
    }

    // Convertir el Map de valores únicos a un array de opciones
    const uniqueOptions: FilterOption[] = [];

    if (facetedUniqueValues) {
      facetedUniqueValues.forEach((count, value) => {
        // Solo agregar valores no nulos o indefinidos
        if (value !== null && value !== undefined && value !== "") {
          uniqueOptions.push({
            label: String(value),
            value: String(value),
          });
        }
      });
    }

    // Ordenar opciones alfabéticamente
    return uniqueOptions.sort((a, b) => a.label.localeCompare(b.label));
  }, [facetedUniqueValues, predefinedOptions]);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  // Si no hay opciones, no mostrar el filtro
  if (options.length === 0) {
    return null;
  }

  const triggerButton = (
    <Button variant="outline" size="sm" className="border-dashed bg-sidebar">
      <span className="flex items-center gap-x-1">
        {Icon && <Icon className="h-4 w-4 mr-1" />}
        <span className="truncate max-w-[100px]">{title}</span>
        {selectedValue ? (
          <>
            :{" "}
            <Badge variant={"secondary"} className="truncate max-w-[80px]">
              {selectedOption?.label}
            </Badge>
          </>
        ) : null}
      </span>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
    </Button>
  );

  const filterContent = (
    <Command>
      <CommandInput placeholder={`Buscar ${title.toLowerCase()}...`} />
      <CommandList className="max-h-[50vh] overflow-auto">
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const count = facetedUniqueValues?.get(option.value) || 0;
            const isSelected =
              selectedValue === option.value ||
              (typeof selectedValue === "string" &&
                typeof option.value === "boolean" &&
                selectedValue === String(option.value)) ||
              (typeof selectedValue === "boolean" &&
                typeof option.value === "string" &&
                String(selectedValue) === option.value);
            return (
              <CommandItem
                key={option.value as string}
                className="flex items-center justify-between"
                onSelect={() => {
                  // Mantener el tipo original del valor
                  const filterValue = option.value;
                  column.setFilterValue(isSelected ? undefined : filterValue);
                  if (!isMobile) setOpen(false);
                }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isSelected ? (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  ) : option.icon ? (
                    <option.icon className="!size-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <div className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
                {count > 0 && (
                  <kbd className="bg-background text-muted-foreground/70 ml-2 inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0">
                    {count}
                  </kbd>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
        {selectedValue && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  column.setFilterValue(undefined);
                  if (!isMobile) setOpen(false);
                }}
                className="justify-center text-center"
              >
                Limpiar filtro
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="bottom" className="bg-sidebar p-0 max-h-[80dvh]">
          <div className="flex h-full w-full flex-col">
            <SheetHeader className="bg-sidebar border-b p-3 text-start">
              <SheetTitle>Filtrar por {title}</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-background p-0">
              {filterContent}
            </div>
            <SheetFooter className="flex flex-col p-3 pb-8 md:pb-3 border-t bg-sidebar">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {filterContent}
      </PopoverContent>
    </Popover>
  );
}

// Actualizar el componente DataTableSelectFilter para unificar estilos
function DataTableSelectFilter<TData, TValue>({
  column,
  title,
  options,
  icon: Icon,
}: {
  column: Column<TData, TValue>;
  title: string;
  options: FilterOption[];
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const facetedFilter = column.getFacetedUniqueValues();
  const selectedValue = column.getFilterValue() as string | number | boolean;
  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const placeholder =
    // @ts-expect-error - Type 'string | undefined' is not assignable to type 'string'.
    column.columnDef.meta?.placeholder ||
    `Filtrar por ${title.toLowerCase()}...`;

  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button variant="outline" size="sm" className="border-dashed bg-sidebar">
      <span className="flex items-center gap-x-1">
        {Icon && <Icon className="!size-3.5 mr-1" />}
        <span className="truncate max-w-[100px]">{title}</span>
        {selectedValue ? (
          <>
            :{" "}
            <Badge variant={"secondary"} className="truncate max-w-[80px]">
              {selectedOption?.label}
            </Badge>
          </>
        ) : null}
      </span>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
    </Button>
  );

  const filterContent = (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const count = facetedFilter?.get(option.value) || 0;
            const isSelected =
              selectedValue === option.value ||
              (typeof selectedValue === "string" &&
                typeof option.value === "boolean" &&
                selectedValue === String(option.value)) ||
              (typeof selectedValue === "boolean" &&
                typeof option.value === "string" &&
                String(selectedValue) === option.value);
            return (
              <CommandItem
                key={option.value as string}
                className="flex items-center justify-between"
                onSelect={() => {
                  column.setFilterValue(isSelected ? undefined : option.value);
                  if (!isMobile) setOpen(false);
                }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isSelected ? (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  ) : option.icon ? (
                    <option.icon className="!size-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <div className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
                {count > 0 && (
                  <kbd className="bg-background text-muted-foreground/70 ml-2 inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0">
                    {count}
                  </kbd>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
        {selectedValue && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  column.setFilterValue(undefined);
                  if (!isMobile) setOpen(false);
                }}
                className="justify-center text-center"
              >
                Limpiar filtro
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="bottom" className="bg-sidebar p-0 max-h-[80dvh]">
          <div className="flex h-full w-full flex-col">
            <SheetHeader className="bg-sidebar border-b p-3 text-start">
              <SheetTitle>Filtrar por {title}</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-background p-0">
              {filterContent}
            </div>
            <SheetFooter className="flex flex-col p-3 pb-8 md:pb-3 border-t bg-sidebar">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {filterContent}
      </PopoverContent>
    </Popover>
  );
}

// Actualizar el componente DataTableMultiSelectFilter para unificar estilos
function DataTableMultiSelectFilter<TData, TValue>({
  column,
  title,
  options,
  icon: Icon,
}: {
  column: Column<TData, TValue>;
  title: string;
  options: FilterOption[];
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const facetedFilter = column.getFacetedUniqueValues();
  const selectedValues = new Set(
    (column.getFilterValue() as Array<string | number | boolean>) || []
  );
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button variant="outline" size="sm" className="border-dashed bg-sidebar">
      <span className="flex items-center gap-x-1">
        {Icon && <Icon className="h-4 w-4 mr-1" />}
        <span className="truncate max-w-[100px]">{title}</span>
        {selectedValues.size > 0 && (
          <Badge variant="secondary" className="rounded-sm px-1 font-normal">
            {selectedValues.size}
          </Badge>
        )}
      </span>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
    </Button>
  );

  const filterContent = (
    <Command>
      <CommandInput placeholder={`Buscar ${title.toLowerCase()}...`} />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value);
            const count = facetedFilter?.get(option.value) || 0;
            return (
              <CommandItem
                key={option.value as string}
                className="flex items-center justify-between"
                onSelect={() => {
                  // Verificar si el valor ya existe en el conjunto (considerando conversiones de tipo)
                  let valueExists = false;
                  let existingValue: string | number | boolean | undefined;

                  selectedValues.forEach((value) => {
                    if (
                      value === option.value ||
                      (typeof value === "string" &&
                        typeof option.value === "boolean" &&
                        value === String(option.value)) ||
                      (typeof value === "boolean" &&
                        typeof option.value === "string" &&
                        String(value) === option.value)
                    ) {
                      valueExists = true;
                      existingValue = value;
                    }
                  });

                  if (valueExists && existingValue !== undefined) {
                    // Si existe, eliminarlo
                    selectedValues.delete(existingValue);
                  } else {
                    // Si no existe, agregarlo
                    selectedValues.add(option.value);
                  }

                  column.setFilterValue(
                    selectedValues.size ? Array.from(selectedValues) : undefined
                  );
                }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isSelected ? (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  ) : option.icon ? (
                    <option.icon className="!size-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <div className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
                {count > 0 && (
                  <kbd className="bg-background text-muted-foreground/70 ml-2 inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0">
                    {count}
                  </kbd>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
        {selectedValues.size > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  column.setFilterValue(undefined);
                  if (!isMobile) setOpen(false);
                }}
                className="justify-center text-center"
              >
                Limpiar filtros
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="bottom" className="bg-sidebar p-0 max-h-[80dvh]">
          <div className="flex h-full w-full flex-col">
            <SheetHeader className="bg-sidebar border-b p-3 text-start">
              <SheetTitle>Filtrar por {title}</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-background p-0">
              {filterContent}
            </div>
            <SheetFooter className="flex flex-col p-3 pb-8 md:pb-3 border-t bg-sidebar">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {filterContent}
      </PopoverContent>
    </Popover>
  );
}

// Actualizar el componente DataTableTextFilter para unificar estilos
function DataTableTextFilter<TData, TValue>({
  column,
  title,
  placeholder,
  icon: Icon,
}: {
  column: Column<TData, TValue>;
  title: string;
  placeholder: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const value = (column.getFilterValue() as string) || "";
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button variant="outline" size="sm" className="border-dashed bg-sidebar">
      <span className="flex items-center gap-x-1">
        {Icon && <Icon className="h-4 w-4 mr-1" />}
        <span className="truncate max-w-[100px]">{title}</span>
        {value && (
          <>
            :{" "}
            <span className="ml-1 font-medium truncate max-w-[80px]">
              {value}
            </span>
          </>
        )}
      </span>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
    </Button>
  );

  const filterContent = (
    <div className="space-y-2 p-2">
      <h4 className="font-medium text-sm">{title}</h4>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="h-8"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            column.setFilterValue(undefined);
            if (!isMobile) setOpen(false);
          }}
          className="mt-2 w-full"
        >
          Limpiar filtro
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="bottom" className="bg-sidebar p-0 max-h-[80dvh]">
          <div className="flex h-full w-full flex-col">
            <SheetHeader className="bg-sidebar border-b p-3 text-start">
              <SheetTitle>Filtrar por {title}</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-background p-3">
              {filterContent}
            </div>
            <SheetFooter className="flex flex-col p-3 pb-8 md:pb-3 border-t bg-sidebar">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        {filterContent}
      </PopoverContent>
    </Popover>
  );
}

// Componente para filtros de rango
function DataTableRangeFilter<TData, TValue>({
  column,
  title,
  range,
  unit,
  icon: Icon,
}: {
  column: Column<TData, TValue>;
  title: string;
  range: [number, number];
  unit: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const value = (column.getFilterValue() as [number, number]) || [
    range[0],
    range[1],
  ];
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button
      variant="outline"
      size="sm"
      className="h-8 border-dashed bg-sidebar"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{title}</span>
      {value && value[0] !== range[0] && value[1] !== range[1] && (
        <>
          :{" "}
          <span className="ml-1 font-medium">
            {value[0]}
            {unit} - {value[1]}
            {unit}
          </span>
        </>
      )}
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
    </Button>
  );

  const filterContent = (
    <div className="space-y-5 p-4">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-xs">
            {value[0]}
            {unit}
          </span>
          <span className="text-xs">
            {value[1]}
            {unit}
          </span>
        </div>
        <Slider
          defaultValue={value}
          min={range[0]}
          max={range[1]}
          step={1}
          onValueChange={(newValue) => {
            column.setFilterValue(newValue);
          }}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        />
        <div className="flex justify-between">
          <span className="text-xs">
            Min: {range[0]}
            {unit}
          </span>
          <span className="text-xs">
            Max: {range[1]}
            {unit}
          </span>
        </div>
      </div>
      {(value[0] !== range[0] || value[1] !== range[1]) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            column.setFilterValue(undefined);
            if (!isMobile) setOpen(false);
          }}
          className="mt-2 w-full"
        >
          Restablecer
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="bottom" className="bg-sidebar p-0 max-h-[80dvh]">
          <div className="flex h-full w-full flex-col">
            <SheetHeader className="bg-sidebar border-b p-3 text-start">
              <SheetTitle>Filtrar por {title}</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-background p-3">
              {filterContent}
            </div>
            <SheetFooter className="flex flex-col p-3 pb-8 md:pb-3 border-t bg-sidebar">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-[250px] p-4" align="start">
        {filterContent}
      </PopoverContent>
    </Popover>
  );
}
