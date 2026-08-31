import { tool } from "ai";
import { z } from "zod";

async function geocodeLocation(
  location: string
): Promise<{
  latitude: number;
  longitude: number;
  displayName: string;
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    return {
      latitude: Number.parseFloat(result.lat),
      longitude: Number.parseFloat(result.lon),
      displayName: result.display_name,
    };
  } catch {
    return null;
  }
}

export const getMap = tool({
  description:
    "Display an interactive map for a location. You can provide coordinates, a city name, address, or landmark.",
  inputSchema: z.object({
    latitude: z.number().optional().describe("Latitude coordinate"),
    longitude: z.number().optional().describe("Longitude coordinate"),
    location: z
      .string()
      .optional()
      .describe(
        "Location name (e.g., 'Amsterdam', 'Eiffel Tower', '123 Main St')"
      ),
    zoom: z
      .number()
      .min(1)
      .max(18)
      .default(13)
      .describe("Zoom level (1-18, default 13)"),
    marker: z.boolean().default(true).describe("Show marker on the location"),
  }),
  needsApproval: false, // Map display doesn't need approval
  execute: async (input) => {
    let latitude: number;
    let longitude: number;
    let displayName: string | undefined;

    if (input.location) {
      const coords = await geocodeLocation(input.location);
      if (!coords) {
        return {
          error: `Could not find location "${input.location}". Please check the location name.`,
        };
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
      displayName = coords.displayName;
    } else if (input.latitude !== undefined && input.longitude !== undefined) {
      latitude = input.latitude;
      longitude = input.longitude;
    } else {
      return {
        error:
          "Please provide either a location name or both latitude and longitude coordinates.",
      };
    }

    return {
      latitude,
      longitude,
      displayName,
      zoom: input.zoom,
      marker: input.marker,
    };
  },
});
