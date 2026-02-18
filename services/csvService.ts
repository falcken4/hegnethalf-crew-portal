
import { Shift, PracticalInfo, TaskDescription } from '../types';

// Simple CSV parser for browsers (handles quotes and commas)
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current);
        current = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(current);
        result.push(row);
        row = [];
        current = '';
      } else {
        current += char;
      }
    }
  }
  if (row.length > 0 || current !== '') {
    row.push(current);
    result.push(row);
  }
  return result;
}

export const fetchCSVData = async <T,>(url: string, mapper: (row: Record<string, string>) => T): Promise<T[]> => {
  if (!url) return [];
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
    const text = await response.text();
    const data = parseCSV(text);
    
    if (data.length < 2) return [];

    const headers = data[0].map(h => h.trim());
    return data.slice(1).map(row => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return mapper(obj);
    }).filter(item => item !== null) as T[];
  } catch (error) {
    console.error('CSV Fetch Error:', error);
    return [];
  }
};

export const mapShift = (row: Record<string, string>): Shift | null => {
  // Map standard column names - ignore "Kommentar" or sensitive fields
  if (!row['Navn'] && !row['Name']) return null;
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: row['Navn'] || row['Name'],
    date: row['Dato'] || row['Date'],
    startTime: row['Start'],
    endTime: row['Slut'] || row['End'],
    area: row['Område'] || row['Area'],
    role: row['Rolle'] || row['Role'],
    location: row['Lokation'] || row['Location'],
    taskID: row['TaskID'] || row['OpgaveID'] || '',
  };
};

export const mapInfo = (row: Record<string, string>): PracticalInfo | null => {
  if (!row['Titel'] && !row['Title']) return null;
  return {
    section: row['Sektion'] || row['Section'] || 'Diverse',
    title: row['Titel'] || row['Title'],
    bodyMarkdown: row['Indhold'] || row['BodyMarkdown'] || '',
    sortOrder: parseInt(row['SortOrder'] || '0', 10),
  };
};

export const mapTaskDesc = (row: Record<string, string>): TaskDescription | null => {
  if (!row['TaskID'] && !row['OpgaveID']) return null;
  return {
    taskID: row['TaskID'] || row['OpgaveID'],
    description: row['Beskrivelse'] || row['Description'] || '',
  };
};
