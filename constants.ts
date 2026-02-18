
export const CSV_URLS = {
  OVERBLIK: (import.meta as any).env?.VITE_OVERBLIK_CSV_URL || '',
  INFO: (import.meta as any).env?.VITE_INFO_CSV_URL || '',
  TASKDESC: (import.meta as any).env?.VITE_TASKDESC_CSV_URL || '',
  VAGTER: (import.meta as any).env?.VITE_VAGTER_CSV_URL || '',
};

export const REFRESH_INTERVAL = 60000; // 60 seconds

export const formatName = (fullName: string): string => {
  if (!fullName) return '';
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstName} ${lastInitial}.`;
};
