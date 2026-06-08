/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  buildReportType,
  buildUpdatedReportType,
  persistManagedReportTypes,
  readManagedReportTypes,
} from '@/modules/admin/report-types/data/reportTypeRepository';

const ReportTypeManagementContext = createContext(null);

export function ReportTypeManagementProvider({ children }) {
  const [reportTypes, setReportTypes] = useState(readManagedReportTypes);

  const createReportType = useCallback((formData) => {
    const reportType = buildReportType(formData);

    setReportTypes((currentTypes) => {
      const nextTypes = [reportType, ...currentTypes];
      persistManagedReportTypes(nextTypes);
      return nextTypes;
    });

    return reportType;
  }, []);

  const updateReportType = useCallback((typeId, formData) => {
    let updatedType = null;

    setReportTypes((currentTypes) => {
      const nextTypes = currentTypes.map((type) => {
        if (type.id !== typeId) return type;
        updatedType = buildUpdatedReportType(type, formData);
        return updatedType;
      });

      persistManagedReportTypes(nextTypes);
      return nextTypes;
    });

    return updatedType;
  }, []);

  const setReportTypeActive = useCallback((typeId, active) => {
    setReportTypes((currentTypes) => {
      const nextTypes = currentTypes.map((type) =>
        type.id === typeId
          ? {
              ...type,
              active,
              updatedAt: new Date().toISOString(),
              subtypes: type.subtypes.map((subtype) => ({ ...subtype, active })),
            }
          : type
      );

      persistManagedReportTypes(nextTypes);
      return nextTypes;
    });
  }, []);

  const value = useMemo(
    () => ({
      reportTypes,
      activeReportTypes: reportTypes.filter((type) => type.active !== false),
      createReportType,
      updateReportType,
      setReportTypeActive,
    }),
    [createReportType, reportTypes, setReportTypeActive, updateReportType]
  );

  return (
    <ReportTypeManagementContext.Provider value={value}>
      {children}
    </ReportTypeManagementContext.Provider>
  );
}

export function useReportTypeManagement() {
  const context = useContext(ReportTypeManagementContext);
  if (!context) {
    throw new Error('useReportTypeManagement debe usarse dentro de ReportTypeManagementProvider');
  }
  return context;
}
