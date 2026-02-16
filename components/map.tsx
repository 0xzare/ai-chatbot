"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapData = {
  latitude: number;
  longitude: number;
  displayName?: string;
  zoom?: number;
  marker?: boolean;
  error?: string;
};

export function Map({ mapData }: { mapData: MapData }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [mapData.longitude, mapData.latitude],
      zoom: mapData.zoom || 13,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add marker if enabled
    if (mapData.marker) {
      new maplibregl.Marker({ color: "#3b82f6" })
        .setLngLat([mapData.longitude, mapData.latitude])
        .addTo(map.current);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapData.latitude, mapData.longitude, mapData.zoom, mapData.marker]);

  if (mapData.error) {
    return (
      <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
        <div className="text-sm text-red-600 dark:text-red-400">
          {mapData.error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {mapData.displayName || "Location Map"}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {mapData.latitude.toFixed(4)}°, {mapData.longitude.toFixed(4)}°
            </span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-[400px] bg-zinc-100 dark:bg-zinc-900"
      />
    </div>
  );
}
