
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
