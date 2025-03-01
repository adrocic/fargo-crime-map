// src/hooks/useQueryCrimeData.ts
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { format, isValid } from "date-fns";

// Define specific types
export interface CrimeDataType {
    id?: string;
    latitude: string;
    longitude: string;
    type?: string;
    description?: string;
    address?: string;
    date?: string;
    [key: string]: string | undefined; // More specific than any
}

export interface CrimeDataFilters {
    startDate?: Date | string | null;
    endDate?: Date | string | null;
}

// Define a type for error response data
interface ErrorResponse {
    message?: string;
    error?: string;
    [key: string]: unknown;
}

/**
 * Formats a date safely for API requests
 * @param date The date to format
 * @returns Formatted date string or undefined if invalid
 */
const safeFormatDate = (date: Date | string | null | undefined): string | undefined => {
    // Handle null/undefined
    if (date === null || date === undefined) return undefined;

    // If it's already a string, validate if it's a valid date
    if (typeof date === "string") {
        // If already in YYYY-MM-DD format, just return it
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }

        // Try to parse and format
        const parsedDate = new Date(date);
        if (isValid(parsedDate)) {
            return format(parsedDate, "yyyy-MM-dd");
        }
        return undefined;
    }

    // If it's a Date object, check validity and format
    return isValid(date) ? format(date, "yyyy-MM-dd") : undefined;
};

const fetchDispatchData = async (filters: CrimeDataFilters): Promise<CrimeDataType[]> => {
    try {
        const params = new URLSearchParams();

        // Format dates safely
        const startDateStr = safeFormatDate(filters?.startDate);
        const endDateStr = safeFormatDate(filters?.endDate);

        if (startDateStr) {
            params.append("startDate", startDateStr);
        }

        if (endDateStr) {
            params.append("endDate", endDateStr);
        }

        // Only make the API call if both dates are valid
        if (!startDateStr || !endDateStr) {
            console.warn("Invalid date range provided, skipping API call");
            return [];
        }

        console.info(`Fetching crime data from ${startDateStr} to ${endDateStr}`);
        const response = await axios.get<CrimeDataType[]>(`http://localhost:3000/api/dispatch?${params.toString()}`);

        // Process the response data to ensure latitude/longitude are strings
        return response.data.map((item: CrimeDataType) => ({
            ...item,
            latitude: String(item.latitude),
            longitude: String(item.longitude),
        }));
    } catch (error) {
        console.error("Error fetching dispatch data:", error);

        // Provide more helpful error message based on error status
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ErrorResponse>; // Use specific type instead of any

            if (!axiosError.response) {
                throw new Error("Unable to connect to the server. Please check your internet connection.");
            }

            // Handle different error status codes
            const errorData = axiosError.response.data;
            const errorMessage = errorData?.message || errorData?.error || "Bad request";

            switch (axiosError.response.status) {
                case 400:
                    throw new Error(`Invalid request: ${errorMessage}`);
                case 401:
                case 403:
                    throw new Error("Authentication error. Please login again.");
                case 500:
                    throw new Error("Server encountered an error. Please try again later.");
                default:
                    throw new Error(`Error: ${axiosError.response.statusText}`);
            }
        }

        throw error;
    }
};

const useQueryCrimeData = (filters: CrimeDataFilters) => {
    const { data, isLoading, isError, error } = useQuery<CrimeDataType[], Error>(
        // Include serialized date strings in query key so it refreshes properly when dates change
        ["crimeData", safeFormatDate(filters.startDate), safeFormatDate(filters.endDate)],
        () => fetchDispatchData(filters),
        {
            retry: 1, // Only retry once for server errors
            retryDelay: 1000, // Wait 1 second before retrying
            keepPreviousData: true,
            // Only run the query if both dates are valid
            enabled: !!safeFormatDate(filters.startDate) && !!safeFormatDate(filters.endDate),
            onError: (err: Error) => {
                console.error("Query error:", err.message);
            },
        },
    );

    return {
        crimeData: data || [], // Ensure we always return an array
        isLoadingCrimeData: isLoading,
        isErrorCrimeData: isError,
        errorMessage: error?.message,
    };
};

export default useQueryCrimeData;
