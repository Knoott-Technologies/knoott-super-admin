"use client";

import { memo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import type { Feature, FeatureCollection } from "geojson";

interface PartnerDeliveryMapProps {
  value: string[];
  geoJsonData: FeatureCollection | null;
}

interface MexicoFeature extends Feature {
  properties: {
    NOMGEO?: string;
    CVE_ENT?: string;
    NAME_1?: string;
    NAME_2?: string;
    [key: string]: any;
  };
}

interface MapTooltipProps {
  content: string;
  visible: boolean;
  x: number;
  y: number;
}

// Custom tooltip component that follows the mouse
const MapTooltip = ({ content, visible, x, y }: MapTooltipProps) => {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 bg-sidebar text-black shadow-md border px-1.5 py-0.5 text-xs pointer-events-none"
      style={{
        left: `${x + 10}px`,
        top: `${y - 30}px`,
        transform: "translateX(-50%)",
      }}
    >
      {content}
    </div>
  );
};

// Memoized map component to prevent unnecessary re-renders
const MexicoMap = memo(
  ({
    geoData,
    selectedRegions,
  }: {
    geoData: FeatureCollection | null;
    selectedRegions: string[];
  }) => {
    const [tooltip, setTooltip] = useState<{
      content: string;
      visible: boolean;
      x: number;
      y: number;
    }>({
      content: "",
      visible: false,
      x: 0,
      y: 0,
    });
    const mapRef = useRef<HTMLDivElement>(null);

    // Get state name from state code
    const getEstadoName = (cveEnt: string): string => {
      const estados: Record<string, string> = {
        "01": "Aguascalientes",
        "02": "Baja California",
        "03": "Baja California Sur",
        "04": "Campeche",
        "05": "Coahuila",
        "06": "Colima",
        "07": "Chiapas",
        "08": "Chihuahua",
        "09": "Ciudad de México",
        "10": "Durango",
        "11": "Guanajuato",
        "12": "Guerrero",
        "13": "Hidalgo",
        "14": "Jalisco",
        "15": "Estado de México",
        "16": "Michoacán",
        "17": "Morelos",
        "18": "Nayarit",
        "19": "Nuevo León",
        "20": "Oaxaca",
        "21": "Puebla",
        "22": "Querétaro",
        "23": "Quintana Roo",
        "24": "San Luis Potosí",
        "25": "Sinaloa",
        "26": "Sonora",
        "27": "Tabasco",
        "28": "Tamaulipas",
        "29": "Tlaxcala",
        "30": "Veracruz",
        "31": "Yucatán",
        "32": "Zacatecas",
      };
      return estados[cveEnt] || cveEnt;
    };

    // Handle mouse movement for tooltip positioning
    const handleMouseMove = (e: React.MouseEvent) => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        setTooltip((prev) => ({
          ...prev,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }));
      }
    };

    if (!geoData) return null;

    return (
      <div
        ref={mapRef}
        className="relative w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 2000,
            center: [-102, 23],
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup zoom={1} center={[-102, 23]}>
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const feature = geo as MexicoFeature;
                  // Try to get the name from different property fields
                  const municipio =
                    feature.properties?.NAME_2 ||
                    feature.properties?.NOMGEO ||
                    "";
                  const estado = feature.properties?.NAME_1
                    ? feature.properties.NAME_1
                    : feature.properties?.CVE_ENT
                    ? getEstadoName(feature.properties.CVE_ENT)
                    : "";

                  // Asegurarse de que el formato sea consistente para el regionKey
                  const regionKey = `${municipio}|${estado}`;
                  const isSelected = selectedRegions.includes(regionKey);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => {
                        setTooltip({
                          content: `${municipio}, ${estado}`,
                          visible: true,
                          x: tooltip.x,
                          y: tooltip.y,
                        });
                      }}
                      onMouseLeave={() => {
                        setTooltip((prev) => ({ ...prev, visible: false }));
                      }}
                      style={{
                        default: {
                          fill: isSelected ? "#FFD46A" : "#fafafafa",
                          stroke: "#868686",
                          strokeWidth: 0.2,
                          outline: "none",
                        },
                        hover: {
                          fill: isSelected ? "#FFD46A" : "#f1f1f1",
                          stroke: "#868686",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#FFD46A",
                          stroke: "#868686",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Custom tooltip */}
        <MapTooltip
          content={tooltip.content}
          visible={tooltip.visible}
          x={tooltip.x}
          y={tooltip.y}
        />
      </div>
    );
  }
);

MexicoMap.displayName = "MexicoMap";

export default function PartnerDeliveryMap({
  value,
  geoJsonData,
}: PartnerDeliveryMapProps) {
  return (
    <Card className="border">
      <CardContent className="p-0 overflow-hidden">
        <div className="h-auto aspect-square w-full relative bg-blue-50">
          {!geoJsonData ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
              <p>Cargando mapa...</p>
            </div>
          ) : (
            <MexicoMap geoData={geoJsonData} selectedRegions={value} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
