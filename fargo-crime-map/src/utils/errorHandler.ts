import axios, { AxiosError } from "axios";

export enum ErrorType {
    SERVER_ERROR = "SERVER_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    AUTH_ERROR = "AUTH_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AppError {
    type: ErrorType;
    message: string;
    details?: unknown;
}

export const handleApiError = (error: unknown): AppError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (!axiosError.response) {
            return {
                type: ErrorType.NETWORK_ERROR,
                message: "Unable to connect to the server. Please check your internet connection.",
            };
        }

        switch (axiosError.response.status) {
            case 400:
                return {
                    type: ErrorType.VALIDATION_ERROR,
                    message: "Invalid request data. Please check your inputs.",
                    details: axiosError.response.data,
                };
            case 401:
            case 403:
                return {
                    type: ErrorType.AUTH_ERROR,
                    message: "Authentication error. Please login again.",
                };
            case 500:
                return {
                    type: ErrorType.SERVER_ERROR,
                    message: "Server encountered an error. Please try again later.",
                };
            default:
                return {
                    type: ErrorType.UNKNOWN_ERROR,
                    message: `Error: ${axiosError.response.statusText}`,
                    details: axiosError.response.data,
                };
        }
    }

    // Handle non-Axios errors
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return {
        type: ErrorType.UNKNOWN_ERROR,
        message: errorMessage,
        details: error,
    };
};
