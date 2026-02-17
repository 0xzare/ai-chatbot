import { tool } from "ai";
import { z } from "zod";
import { geocodeIranianAddress } from "@/lib/ai/utils/geocoding";

const NESHAN_API_KEY = process.env?.NESHAN_API_KEY;

export const addressToPoint = tool({
    description:
        "Convert Persian/Farsi addresses to geographic coordinates (latitude/longitude) using Neshan Geocoding API. Optimized for accurate Iranian addresses and locations.",
    inputSchema: z.object({
        address: z
            .string()
            .min(5)
            .describe("Complete address in Persian (e.g., 'تهران، خیابان ولیعصر، خیابان بهشتی')"),
    }),
    needsApproval: false,
    execute: async (input) => {
        if (!NESHAN_API_KEY) {
            throw new Error("NESHAN_API_KEY is not configured in environment variables");
        }

        const result = await geocodeIranianAddress(input.address, NESHAN_API_KEY);

        if (!result) {
            return {
                success: false,
                error: `Could not geocode address: "${input.address}". Please check the address format.`,
            };
        }

        return {
            success: true,
            address: input.address,
            location: {
                latitude: result.latitude,
                longitude: result.longitude,
            },
            formattedAddress: result.formattedAddress,
            accuracy: "high", // Neshan provides high accuracy for Iranian addresses
        };
    },
});
