
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

/**
 * Formats a date value as a localized time string
 * @param dateValue - Date object, ISO string, or any date-like value
 * @param options - Options for time formatting
 * @returns A formatted time string
 */
export const formatTime = (
  dateValue: Date | string | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = ensureDate(dateValue);
  return date.toLocaleTimeString(undefined, options);
};

/**
 * Formats a date value as a localized date and time string
 * @param dateValue - Date object, ISO string, or any date-like value
 * @param options - Options for date and time formatting
 * @returns A formatted date and time string
 */
export const formatDateTime = (
  dateValue: Date | string | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = ensureDate(dateValue);
  return date.toLocaleString(undefined, options);
};

/**
 * Checks if a date is in the past
 * @param dateValue - Date object, ISO string, or any date-like value
 * @returns True if the date is in the past, false otherwise
 */
export const isDatePast = (dateValue: Date | string | undefined): boolean => {
  const date = ensureDate(dateValue);
  const now = new Date();
  return date < now;
};

/**
 * Gets the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date (defaults to current date)
 * @returns The number of days between the two dates
 */
export const getDaysDifference = (
  date1: Date | string | undefined,
  date2: Date | string | undefined = new Date()
): number => {
  const d1 = ensureDate(date1);
  const d2 = ensureDate(date2);
  
  // Convert both dates to UTC to avoid timezone issues
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  
  // Calculate difference in days
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};
