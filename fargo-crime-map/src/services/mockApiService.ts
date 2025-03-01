import { CrimeDataType } from "../Hooks/QueryCrimeData/useQueryCrimeData";

// Mock data for local development
const generateMockData = (count: number): CrimeDataType[] => {
    // Fargo, ND area coordinates
    const centerLat = 46.8772;
    const centerLng = -96.7898;
    const radius = 0.05; // Roughly a few miles

    const crimeTypes = [
        "Theft",
        "Assault",
        "Vandalism",
        "Burglary",
        "Traffic Violation",
        "Suspicious Activity",
        "Noise Complaint",
    ];

    const addresses = [
        "123 Main St",
        "456 Broadway Ave",
        "789 University Dr",
        "101 25th St",
        "202 13th Ave",
        "303 45th St S",
        "404 32nd Ave N",
    ];

    return Array.from({ length: count }, (_, i) => {
        // Generate random coordinates around Fargo
        const lat = (centerLat + (Math.random() - 0.5) * radius).toFixed(6);
        const lng = (centerLng + (Math.random() - 0.5) * radius).toFixed(6);

        // Random crime type and address
        const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
        const address = addresses[Math.floor(Math.random() * addresses.length)];

        return {
            id: `mock-${i}`,
            latitude: lat,
            longitude: lng,
            type: crimeType,
            address,
            date: new Date().toISOString(),
            description: `Mock ${crimeType.toLowerCase()} incident`,
            [crimeType.toLowerCase()]: "Yes", // Add a dynamic field based on the crime type
        };
    });
};

/**
 * Mock fetch function that returns crime data for development
 */
export const fetchMockCrimeData = async (startDate: string, endDate: string): Promise<CrimeDataType[]> => {
    console.log(`[MOCK API] Fetching crime data from ${startDate} to ${endDate}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate 20-50 random incidents
    const count = Math.floor(Math.random() * 30) + 20;
    return generateMockData(count);
};

// Helper to determine if we should use mock data
export const shouldUseMockApi = (): boolean => {
    return process.env.REACT_APP_USE_MOCK_API === "true" || process.env.NODE_ENV === "development";
};
