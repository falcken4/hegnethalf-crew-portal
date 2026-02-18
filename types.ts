
export interface OverblikRow {
  navn: string;
  dato: string;
  start: string;
  slut: string;
  område: string;
  rolle: string;
  lokation: string;
  ansvarlig: string;
  taskId?: string; // Tilføjet til joining logic
}

export interface PracticalInfoItem {
  audience: string;
  section: string;
  title: string;
  bodyMarkdown: string;
  sortOrder: number;
  lastUpdated: string;
}

export interface TaskDesc {
  taskId: string;
  beskrivelse: string;
  mødested: string;
  udstyr: string;
  succes: string;
}

export interface VagtRow {
  vagtId: string;
  dato: string;
  start: string;
  slut: string;
  område: string;
  rolle: string;
  lokation: string;
  taskId: string;
}

export interface DatasetState<T> {
  data: T[];
  lastUpdated: string | null;
}

export interface AllDatasets {
  overblik: DatasetState<OverblikRow>;
  info: DatasetState<PracticalInfoItem>;
  taskDesc: DatasetState<TaskDesc>;
  vagter: DatasetState<VagtRow>;
  loading: boolean;
  error: string | null;
}

/**
 * Legacy types required by existing components and hooks.
 */
export interface Shift {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  area: string;
  role: string;
  location: string;
  taskID: string;
}

export interface PracticalInfo {
  section: string;
  title: string;
  bodyMarkdown: string;
  sortOrder: number;
}

export interface TaskDescription {
  taskID: string;
  description: string;
}

export interface AppData {
  shifts: Shift[];
  info: PracticalInfo[];
  descriptions: TaskDescription[];
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
}
