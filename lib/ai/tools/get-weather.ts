import { tool } from "ai";
import { z } from "zod";
import { geocodeLocation } from "@/lib/ai/utils/geocoding";

export const getWeather = tool({
  description:
      "Get real-time weather data for any location worldwide. Provides current temperature, hourly forecast, and sunrise/sunset times. Supports both city names and geographic coordinates.",
  inputSchema: z.object({
    latitude: z
        .number()
        .min(-90)
        .max(90)
        .optional()
        .describe("Latitude coordinate (range: -90 to 90)"),
    longitude: z
        .number()
        .min(-180)
        .max(180)
        .optional()
        .describe("Longitude coordinate (range: -180 to 180)"),
    city: z
        .string()
        .optional()
        .describe("City or location name in any language (e.g., 'San Francisco', 'تهران', 'London')"),
  }),
  needsApproval: false, // Weather lookup is safe
  execute: async (input) => {
    let latitude: number;
    let longitude: number;
    let displayName: string | undefined;

    // Prioritize city name over coordinates
    if (input.city) {
      const coords = await geocodeLocation(input.city);
      if (!coords) {
        return {
          error: `Could not find coordinates for "${input.city}". Please verify the location name or try using coordinates.`,
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
        error: "Please provide either a city name or both latitude and longitude coordinates.",
      };
    }

    // Fetch weather data from Open-Meteo API
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
    );

    if (!response.ok) {
      return {
        error: `Weather API error: ${response.status}. Please try again later.`,
      };
    }

    const weatherData = await response.json();

    // Add location metadata
    if (displayName) {
      weatherData.cityName = displayName;
    } else if (input.city) {
      weatherData.cityName = input.city;
    }

    return weatherData;
  },
});
