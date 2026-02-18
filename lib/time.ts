
/**
 * Parses time strings like "7.00", "07:00", "07.00.00" into minutes from midnight for sorting.
 */
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  // Replace dots with colons to normalize
  const normalized = timeStr.replace(/\./g, ':');
  const parts = normalized.split(':').map(p => parseInt(p, 10));
  
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  // We ignore seconds for this sorting
  return hours * 60 + minutes;
};

/**
 * Sorts an array of objects by a date property and a time property.
 */
export const sortShifts = <T extends { dato: string; start: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    // Basic date compare (assumes YYYY-MM-DD or similar sortable string, or specific DD-MM format)
    // For robust Danish dates, we might need a more complex parser, but usually Google Sheets 
    // provides sortable dates if formatted correctly.
    const dateA = a.dato || '';
    const dateB = b.dato || '';
    
    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }
    
    return timeToMinutes(a.start) - timeToMinutes(b.start);
  });
};

export const formatDisplayTime = (isoString: string | null): string => {
  if (!isoString) return 'Aldrig';
  const date = new Date(isoString);
  return date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
};
