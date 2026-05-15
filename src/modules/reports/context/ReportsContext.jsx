/**
 * ReportsContext.jsx – Contexto global de reportes.
 *
 * Qué hace:
 *   Gestiona la lista de reportes ambientales y la persiste en localStorage
 *   (clave: 'cleanvalle_reports'). Al no haber datos guardados, carga
 *   MOCK_REPORTS como estado inicial para demostración.
 *
 * Cuándo conectar al backend:
 *   - addReport()       → POST /api/reports
 *   - getUserReports()  → GET  /api/reports?userId=...
 *   - getResolvedReports() → GET /api/reports?status=resuelto
 *   Reemplazar las lecturas/escrituras en localStorage por llamadas fetch/axios.
 *
 * API expuesta por useReports():
 *   reports           {Report[]}   – Lista completa de reportes en memoria.
 *   addReport(data, userId)        – Crea un nuevo reporte y lo persiste.
 *   getUserReports(userId)         – Filtra reportes por creador (o todos si userId es falsy).
 *   getResolvedReports()           – Retorna solo reportes con status 'resuelto'.
 *
 * Estructura de un reporte:
 *   id, title, description, location, riskLevel, reportType,
 *   incidentDate, status, createdAt, createdBy, images[],
 *   resolution?, resolvedAt?, operatorName?
 */
/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_REPORTS } from '../constants/reportConstants';

const ReportsContext = createContext();

const REPORTS_STORAGE_KEY = 'cleanvalle_reports';

/* ── Helpers de persistencia ─────────────────────────────────────────────── */

/** Carga reportes desde localStorage; cae a MOCK_REPORTS si no hay datos. */
const loadReports = () => {
  const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
  if (!stored) return MOCK_REPORTS;
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_REPORTS;
  }
};

/** Persiste la lista de reportes en localStorage. */
const saveReports = (reports) => {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
};

/* ── Provider ─────────────────────────────────────────────────────────────── */

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState(() => loadReports());

  /**
   * Crea un nuevo reporte con estado 'pendiente' y lo antepone a la lista.
   * @param {object} reportData – Datos del formulario (sin id, status ni createdAt).
   * @param {string} userId     – ID del usuario que crea el reporte.
   * @returns {object} El reporte recién creado.
   */
  const addReport = useCallback((reportData, userId) => {
    const newReport = {
      id:        `r-${Date.now()}`,
      ...reportData,
      status:    'pendiente',
      createdAt: new Date().toISOString(),
      createdBy: userId,
      images:    [],
    };
    setReports((prev) => {
      const updated = [newReport, ...prev];
      saveReports(updated);
      return updated;
    });
    return newReport;
  }, []);

  /**
   * Filtra reportes por el usuario creador.
   * Si userId es falsy retorna todos los reportes (útil para vistas de operador).
   * @param {string} userId
   * @returns {Report[]}
   */
  const getUserReports = useCallback(
    (userId) => reports.filter((r) => !userId || r.createdBy === userId || r.createdBy === undefined),
    [reports]
  );

  /**
   * Retorna solo los reportes con status 'resuelto'.
   * Usados en la pestaña "Resueltos por operadores" de ViewReportsPage.
   * @returns {Report[]}
   */
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

/**
 * Hook para consumir el contexto de reportes.
 * Debe usarse dentro de <ReportsProvider>.
 * @returns {{ reports, addReport, getUserReports, getResolvedReports }}
 */
export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports debe ser usado dentro de ReportsProvider');
  return context;
};
