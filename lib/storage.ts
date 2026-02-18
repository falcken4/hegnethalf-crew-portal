
import { DatasetState } from '../types';

const STORAGE_PREFIX = 'crew_app_';

export const saveDataset = <T>(key: string, state: DatasetState<T>) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

export const loadDataset = <T>(key: string): DatasetState<T> | null => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Error loading from localStorage', e);
    return null;
  }
};
