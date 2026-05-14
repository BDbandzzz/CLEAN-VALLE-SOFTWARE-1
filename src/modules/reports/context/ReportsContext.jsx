/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_REPORTS } from '../constants/reportConstants';

const ReportsContext = createContext();

const REPORTS_STORAGE_KEY = 'cleanvalle_reports';

const loadReports = () => {
  const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
  if (!stored) return MOCK_REPORTS;
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_REPORTS;
  }
};

const saveReports = (reports) => {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
};

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState(() => loadReports());

  const addReport = useCallback((reportData, userId) => {
    const newReport = {
      id: `r-${Date.now()}`,
      ...reportData,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      createdBy: userId,
      images: [],
    };
    setReports((prev) => {
      const updated = [newReport, ...prev];
      saveReports(updated);
      return updated;
    });
    return newReport;
  }, []);

  const getUserReports = useCallback(
    (userId) => reports.filter((r) => !userId || r.createdBy === userId || r.createdBy === undefined),
    [reports]
  );

  const getResolvedReports = useCallback(
    () => reports.filter((r) => r.status === 'resuelto'),
    [reports]
  );

  return (
    <ReportsContext.Provider value={{ reports, addReport, getUserReports, getResolvedReports }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports debe ser usado dentro de ReportsProvider');
  return context;
};
