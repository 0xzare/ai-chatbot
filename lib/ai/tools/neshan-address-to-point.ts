import { tool } from "ai";
import { z } from "zod";

const NESHAN_API_KEY = process.env?.NESHAN_API_KEY;

export const addressToPoint = tool({
    description:
        "Convert Persian/Farsi addresses to geographic coordinates using Neshan Geocoding API v6. Returns precise location data including coordinates, formatted address, and neighborhood information for Iranian addresses.",
    inputSchema: z.object({
        address: z
            .string()
            .min(3)
            .describe("Complete address in Persian or English (e.g., 'تهران، خیابان ولیعصر' or 'Tehran, Valiasr Street')"),
    }),
    needsApproval: false,
    execute: async (input) => {
        if (!NESHAN_API_KEY) {
            throw new Error("NESHAN_API_KEY is not configured in environment variables");
        }

        // Neshan v6 uses simple query parameter
        const url = `https://api.neshan.org/v6/geocoding?address=${encodeURIComponent(input.address)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Api-Key": NESHAN_API_KEY,
            },
        });

        if (!response.ok) {
            return {
                success: false,
                error: `Neshan API error: ${response.status}. ${response.status === 401 ? 'Invalid API key.' : 'Please try again later.'}`,
            };
        }

        const result = await response.json();

        // Check if location exists in response
        if (!result.location || !result.location.x || !result.location.y) {
            return {
                success: false,
                error: `No location found for address: "${input.address}". Please verify the address.`,
            };
        }

        return {
            success: true,
            address: input.address,
            location: {
                latitude: result.location.y,   // Neshan: y = latitude
                longitude: result.location.x,  // Neshan: x = longitude
            },
            formattedAddress: result.formatted_address || input.address,
            neighbourhood: result.neighbourhood || null,
            city: result.city || null,
            state: result.state || null,
            status: result.status || "OK",
        };
    },
});
