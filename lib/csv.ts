
import Papa from 'papaparse';
import { OverblikRow, PracticalInfoItem, TaskDesc, VagtRow } from '../types';

const trimValue = (val: any) => (typeof val === 'string' ? val.trim() : val);

/**
 * Strips any object of potentially sensitive keys before they even reach the mappers.
 * This is a secondary layer of protection.
 */
const sanitizeRawRow = (row: any) => {
  const sensitiveKeys = ['kommentar', 'comment', 'email', 'tlf', 'telefon', 'phone', 'bemærkning'];
  const clean: any = {};
  for (const key in row) {
    const k = key.trim();
    if (!sensitiveKeys.some(sk => k.toLowerCase().includes(sk))) {
      clean[k] = trimValue(row[key]);
    }
  }
  return clean;
};

const parseCsv = <T>(csvText: string, mapper: (row: any) => T): T[] => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  return result.data
    .map((row: any) => sanitizeRawRow(row))
    .map((cleanRow: any) => mapper(cleanRow))
    .filter(item => item !== null);
};

export const fetchCsv = async <T>(url: string, mapper: (row: any) => T): Promise<T[]> => {
  if (!url || url.trim() === '') return [];
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
  const text = await response.text();
  return parseCsv(text, mapper);
};

// Mappers are strict: only take what we need
export const mapOverblik = (row: any): OverblikRow => ({
  navn: row['Navn'] || row['Name'] || '',
  dato: row['Dato'] || row['Date'] || '',
  start: row['Start'] || '',
  slut: row['Slut'] || row['End'] || '',
  område: row['Område'] || row['Area'] || '',
  rolle: row['Rolle'] || row['Role'] || '',
  lokation: row['Lokation'] || row['Location'] || '',
  ansvarlig: row['Ansvarlig'] || row['Responsible'] || '',
  taskId: row['TaskID'] || row['OpgaveID'] || undefined,
});

export const mapPracticalInfo = (row: any): PracticalInfoItem => ({
  audience: row['Audience'] || 'Alle',
  section: row['Sektion'] || row['Section'] || 'Info',
  title: row['Titel'] || row['Title'] || '',
  bodyMarkdown: row['Indhold'] || row['BodyMarkdown'] || '',
  sortOrder: parseInt(row['SortOrder'] || '0', 10),
  lastUpdated: row['LastUpdated'] || '',
});

export const mapTaskDesc = (row: any): TaskDesc => ({
  taskId: row['TaskID'] || row['OpgaveID'] || '',
  beskrivelse: row['Beskrivelse'] || row['Description'] || '',
  mødested: row['Mødested'] || row['MeetingPoint'] || '',
  udstyr: row['Udstyr'] || row['Equipment'] || '',
  succes: row['Succes'] || row['SuccessCriteria'] || '',
});

export const mapVagt = (row: any): VagtRow => ({
  vagtId: row['VagtID'] || row['ShiftID'] || Math.random().toString(36).substr(2, 9),
  dato: row['Dato'] || row['Date'] || '',
  start: row['Start'] || '',
  slut: row['Slut'] || row['End'] || '',
  område: row['Område'] || row['Area'] || '',
  rolle: row['Rolle'] || row['Role'] || '',
  lokation: row['Lokation'] || row['Location'] || '',
  taskId: row['TaskID'] || row['OpgaveID'] || '',
});
