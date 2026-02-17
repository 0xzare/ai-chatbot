/**
 * Shared geocoding utilities for all tools
 */

// OpenStreetMap Nominatim (Free, for international)
export async function geocodeLocation(
    location: string
): Promise<{ latitude: number; longitude: number; displayName: string } | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
        );

        if (!response.ok) return null;

        const data = await response.json();
        if (!data || data.length === 0) return null;

        const result = data[0];
        return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            displayName: result.display_name,
        };
    } catch {
        return null;
    }
}

// Neshan Geocoding (for Iranian addresses)
export async function geocodeIranianAddress(
    address: string,
    apiKey: string
): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null> {
    try {
        const requestData = {
            address,
            extent: {
                southWest: { latitude: 35.5, longitude: 51.2 },
                northEast: { latitude: 35.8, longitude: 51.6 }
            }
        };

        const response = await fetch(
            `https://api.neshan.org/geocoding/v1/?json=${encodeURIComponent(JSON.stringify(requestData))}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiKey,
                },
            }
        );

        if (!response.ok) return null;

        const result = await response.json();
        if (result.status !== "OK" || !result.items || result.items.length === 0) {
            return null;
        }

        const firstItem = result.items[0];
        return {
            latitude: firstItem.location.y,
            longitude: firstItem.location.x,
            formattedAddress: firstItem.formattedAddress || address,
        };
    } catch {
        return null;
    }
}
