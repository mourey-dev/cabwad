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
