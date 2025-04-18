export const toUpperCase = (value: string) => value.toUpperCase();

/**
 * Capitalizes the first letter of each word in a string
 * @param value - The string to capitalize
 * @returns The capitalized string
 */
export const capitalizeWords = (value: string): string => {
  if (!value) return "";

  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Capitalizes the first letter of a string
 * @param value - The string to capitalize
 * @returns The capitalized string
 */
export const capitalizeFirst = (value: string): string => {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

/**
 * Formats a name (first, middle, last) with proper capitalization
 * @param firstName - First name
 * @param middleName - Middle name (optional)
 * @param lastName - Last name
 * @returns Formatted full name
 */
export const formatName = (
  firstName: string,
  lastName: string,
  middleName?: string | null,
): string => {
  const formattedFirst = capitalizeWords(firstName);
  const formattedLast = capitalizeWords(lastName);

  if (middleName) {
    const formattedMiddle = capitalizeWords(middleName);
    return `${formattedFirst} ${formattedMiddle} ${formattedLast}`;
  }

  return `${formattedFirst} ${formattedLast}`;
};

/**
 * Formats an address string with proper capitalization
 * @param address - The address to format
 * @returns Formatted address
 */
export const formatAddress = (address: string): string => {
  if (!address) return "";

  // Special handling for address with specific parts that should remain uppercase
  const uppercaseWords = ["id", "po", "zip", "box"];

  return address
    .toLowerCase()
    .split(" ")
    .map((word) =>
      uppercaseWords.includes(word)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
};

/**
 * Formats a date string to localized format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

/**
 * Converts a date string to the format "Month Day, Year" (e.g., "January 20, 2025")
 * This function can handle various date string formats including ISO strings,
 * date objects, and already formatted strings.
 *
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "January 20, 2025") or empty string if invalid
 */
export const formatToMonthDayYear = (
  dateString: string | Date | null | undefined,
): string => {
  if (!dateString) return "";

  try {
    // Check if it's already in the correct format (i.e., "January 20, 2025")
    const monthDayYearRegex = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;
    if (typeof dateString === "string" && monthDayYearRegex.test(dateString)) {
      return dateString; // Already in the correct format
    }

    // Convert to Date object
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}`);
      return "";
    }

    // Format to "Month Day, Year"
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return "";
  }
};

/**
 * Parses a date string in "Month Day, Year" format (e.g., "January 20, 2025")
 * and returns a Date object.
 *
 * @param formattedDate - Date string in "Month Day, Year" format
 * @returns Date object or null if invalid
 */
export const parseMonthDayYear = (formattedDate: string): Date | null => {
  if (!formattedDate) return null;

  try {
    // Parse the formatted date string
    const parts = formattedDate.split(", ");
    if (parts.length !== 2) return null;

    const yearStr = parts[1];
    const monthDayParts = parts[0].split(" ");
    if (monthDayParts.length !== 2) return null;

    const monthStr = monthDayParts[0];
    const dayStr = monthDayParts[1];

    // Convert month name to month number (0-11)
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === monthStr.toLowerCase(),
    );

    if (monthIndex === -1) return null;

    const year = parseInt(yearStr, 10);
    const day = parseInt(dayStr, 10);

    const date = new Date(year, monthIndex, day);
    return date;
  } catch (error) {
    console.error(`Error parsing date: ${formattedDate}`, error);
    return null;
  }
};

/**
 * Determines if a string is already in the "Month Day, Year" format
 *
 * @param dateString - The date string to check
 * @returns Boolean indicating if the string is in "Month Day, Year" format
 */
export const isMonthDayYearFormat = (dateString: string): boolean => {
  if (!dateString) return false;
  const monthDayYearRegex = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;
  return monthDayYearRegex.test(dateString);
};
