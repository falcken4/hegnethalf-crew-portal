
import { OverblikRow, VagtRow, TaskDesc } from '../types';

const normalize = (s: string) => s?.trim().toLowerCase() || '';

export const findTaskIdForShift = (shift: OverblikRow, vagter: VagtRow[]): string => {
  // 1. Check if TaskID is already in Overblik
  if (shift.taskId) return shift.taskId.trim();

  // 2. Search in Vagter dataset by matching fields
  const match = vagter.find(v => 
    normalize(v.dato) === normalize(shift.dato) &&
    normalize(v.start) === normalize(shift.start) &&
    normalize(v.slut) === normalize(shift.slut) &&
    normalize(v.område) === normalize(shift.område) &&
    normalize(v.rolle) === normalize(shift.rolle) &&
    normalize(v.lokation) === normalize(shift.lokation)
  );

  return match?.taskId || '';
};

export const getTaskDescription = (taskId: string, descriptions: TaskDesc[]): TaskDesc | undefined => {
  if (!taskId) return undefined;
  const tid = taskId.trim().toLowerCase();
  return descriptions.find(d => normalize(d.taskId) === tid);
};

export const isAnsvarlig = (val: string): boolean => {
  const n = normalize(val);
  return n === 'ja' || n === 'sand' || n === 'true' || n === 'x';
};
