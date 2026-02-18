
import { useState, useEffect, useCallback } from 'react';
import { AppData } from '../types';
import { CSV_URLS, REFRESH_INTERVAL } from '../constants';
import { fetchCSVData, mapShift, mapInfo, mapTaskDesc } from '../services/csvService';

export const useData = () => {
  const [data, setData] = useState<AppData>({
    shifts: [],
    info: [],
    descriptions: [],
    lastUpdated: null,
    loading: true,
    error: null,
  });

  const loadData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const [shifts, info, descriptions] = await Promise.all([
        fetchCSVData(CSV_URLS.OVERBLIK, mapShift),
        fetchCSVData(CSV_URLS.INFO, mapInfo),
        fetchCSVData(CSV_URLS.TASKDESC, mapTaskDesc),
      ]);

      setData({
        shifts,
        info: info.sort((a, b) => a.sortOrder - b.sortOrder),
        descriptions,
        lastUpdated: new Date(),
        loading: false,
        error: null,
      });
    } catch (err) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Kunne ikke hente data. Tjek din internetforbindelse.',
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...data, refresh: loadData };
};
