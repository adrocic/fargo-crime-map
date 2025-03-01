import { format, isValid, parseISO } from "date-fns";

/**
 * Safely formats a date value that could be a string, Date object, or null/undefined
 *
 * @param date The date to format
 * @param formatStr The date-fns format string to use
 * @param fallback Value to return if date is invalid
 * @returns Formatted date string or fallback value
 */
export const formatDateSafe = (
    date: Date | string | null | undefined,
    formatStr: string = "yyyy-MM-dd",
    fallback: string | undefined = undefined,
): string | undefined => {
    if (date === null || date === undefined) return fallback;

    try {
        // If it's a string, try to parse it
        if (typeof date === "string") {
            // Handle ISO strings with parseISO first
            const parsedDate = date.includes("T") ? parseISO(date) : new Date(date);
            return isValid(parsedDate) ? format(parsedDate, formatStr) : fallback;
        }

        // If it's a Date object, check validity and format
        return isValid(date) ? format(date, formatStr) : fallback;
    } catch (e) {
        console.error(`Error formatting date: ${date}`, e);
        return fallback;
    }
};

/**
 * Validates if a given value is a valid date
 *
 * @param date The date to validate
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (date: any): boolean => {
    if (date === null || date === undefined) return false;

    try {
        if (typeof date === "string") {
            return isValid(new Date(date));
        }

        return isValid(date);
    } catch (e) {
        return false;
    }
};
