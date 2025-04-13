
/**
 * Ensures a date value is a proper Date object
 * @param dateValue - Date object, ISO string, or any date-like value
 * @returns A proper Date object
 */
export const ensureDate = (dateValue: Date | string | undefined): Date => {
  if (!dateValue) {
    return new Date();
  }
  
  if (typeof dateValue === 'string') {
    return new Date(dateValue);
  }
  
  return dateValue;
};

/**
 * Formats a date value as a localized date string
 * @param dateValue - Date object, ISO string, or any date-like value
 * @param options - Options for date formatting
 * @returns A formatted date string
 */
export const formatDate = (
  dateValue: Date | string | undefined, 
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = ensureDate(dateValue);
  return date.toLocaleDateString(undefined, options);
};
