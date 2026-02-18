
import { useState, useEffect, useCallback, useRef } from 'react';
import { AllDatasets, DatasetState } from '../types';
import { fetchCsv, mapOverblik, mapPracticalInfo, mapTaskDesc, mapVagt } from '../lib/csv';
import { loadDataset, saveDataset } from '../lib/storage';
import { CSV_URLS, REFRESH_INTERVAL } from '../constants';

const initialState = (key: string): DatasetState<any> => {
  return loadDataset(key) || { data: [], lastUpdated: null };
};

export const useDatasets = () => {
  const [state, setState] = useState<AllDatasets>({
    overblik: initialState('overblik'),
    info: initialState('info'),
    taskDesc: initialState('taskDesc'),
    vagter: initialState('vagter'),
    loading: false,
    error: null,
  });

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!navigator.onLine) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const results = await Promise.allSettled([
        fetchCsv(CSV_URLS.OVERBLIK, mapOverblik),
        fetchCsv(CSV_URLS.INFO, mapPracticalInfo),
        fetchCsv(CSV_URLS.TASKDESC, mapTaskDesc),
        CSV_URLS.VAGTER ? fetchCsv(CSV_URLS.VAGTER, mapVagt) : Promise.resolve([]),
      ]);

      const now = new Date().toISOString();
      const newStateUpdate: Partial<AllDatasets> = {};

      const [overblikRes, infoRes, taskRes, vagterRes] = results;

      if (overblikRes.status === 'fulfilled') {
        newStateUpdate.overblik = { data: overblikRes.value, lastUpdated: now };
        saveDataset('overblik', newStateUpdate.overblik);
      }
      if (infoRes.status === 'fulfilled') {
        newStateUpdate.info = { data: infoRes.value, lastUpdated: now };
        saveDataset('info', newStateUpdate.info);
      }
      if (taskRes.status === 'fulfilled') {
        newStateUpdate.taskDesc = { data: taskRes.value, lastUpdated: now };
        saveDataset('taskDesc', newStateUpdate.taskDesc);
      }
      if (vagterRes.status === 'fulfilled') {
        newStateUpdate.vagter = { data: vagterRes.value, lastUpdated: now };
        saveDataset('vagter', newStateUpdate.vagter);
      }

      setState(prev => ({
        ...prev,
        ...newStateUpdate,
        loading: false,
        error: results.some(r => r.status === 'rejected') 
          ? 'Nogle data kunne ikke hentes (bruger seneste gemte)' 
          : null
      }));
    } catch (err) {
      console.error('Global fetch error', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Kunne ikke hente data. Tjek din forbindelse.'
      }));
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    pollingRef.current = window.setInterval(fetchData, REFRESH_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchData]);

  const allTimestamps = [
    state.overblik.lastUpdated,
    state.info.lastUpdated,
    state.taskDesc.lastUpdated,
    state.vagter.lastUpdated
  ].filter(Boolean) as string[];

  const globalLastUpdated = allTimestamps.length > 0 
    ? allTimestamps.sort()[0] 
    : null;

  return {
    ...state,
    refreshAll,
    globalLastUpdated,
    isOffline
  };
};
