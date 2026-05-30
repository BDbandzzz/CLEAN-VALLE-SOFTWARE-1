/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useAuth } from '@/core/context/AuthContext';
import { CAMPUS_LOCATIONS, INITIAL_REPORTS } from '@/core/data/cleanvalleSchema';

const ReportsContext = createContext();
const REPORTS_STORAGE_KEY = 'cleanvalle_reports_v2';

function readReports() {
  try {
    const storedReports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY));
    if (!storedReports?.length) return INITIAL_REPORTS;

    const storedIds = new Set(storedReports.map((report) => report.id));
    const missingInitialReports = INITIAL_REPORTS.filter((report) => !storedIds.has(report.id));
    return [...storedReports, ...missingInitialReports];
  } catch {
    return [];
  }
}

function saveReports(reports) {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

function buildReport(formData, userId) {
  const location = CAMPUS_LOCATIONS.find((item) => item.id === formData.locationId);

  return {
    id: `rep-${Date.now()}`,
    title: formData.title.trim(),
    description: formData.description.trim(),
    categoryId: formData.categoryId,
    subtypeId: formData.subtypeId,
    customContext: formData.customContext?.trim() ?? '',
    riskLevelId: formData.riskLevelId,
    locationId: formData.locationId,
    locationName: location?.label ?? formData.locationName?.trim() ?? '',
    coordinates: location?.coordinates ?? null,
    incidentDate: formData.incidentDate,
    evidences: formData.images ?? [],
    statusId: 'pendiente',
    createdBy: userId,
    createdAt: new Date().toISOString(),
    history: [
      {
        statusId: 'pendiente',
        at: new Date().toISOString(),
        by: userId,
        note: 'Reporte creado por el usuario.',
      },
    ],
  };
}

function buildOperatorNotifications(reports, operatorId) {
  return reports
    .flatMap((report) => {
      if (String(report.assignedTo) !== String(operatorId)) return [];

      const notifications = [
        {
          id: `${report.id}-assigned`,
          title: 'Reporte asignado',
          detail: report.title,
          at: report.assignedAt ?? report.createdAt,
          reportId: report.id,
        },
      ];

      if (report.resolution) {
        notifications.push({
          id: `${report.id}-resolution`,
          title: 'Resolucion enviada',
          detail: report.resolution.description,
          at: report.resolution.sentAt,
          reportId: report.id,
        });
      }

      if (report.resolution?.feedback) {
        notifications.push({
          id: `${report.id}-feedback`,
          title: 'Feedback del gestor',
          detail: report.resolution.feedback,
          at: report.resolution.reviewedAt ?? report.resolution.sentAt,
          reportId: report.id,
        });
      }

      return notifications;
    })
    .sort((a, b) => new Date(b.at) - new Date(a.at));
}

function buildManagerNotifications(reports) {
  return reports
    .flatMap((report) => {
      const notifications = [
        {
          id: `${report.id}-manager-created`,
          title: 'Nuevo reporte recibido',
          detail: report.title,
          at: report.createdAt,
          reportId: report.id,
        },
      ];

      if (report.assignedTo) {
        notifications.push({
          id: `${report.id}-manager-assigned`,
          title: 'Reporte asignado',
          detail: report.title,
          at: report.assignedAt ?? report.createdAt,
          reportId: report.id,
        });
      }

      if (report.resolution?.reviewStatusId === 'enviada') {
        notifications.push({
          id: `${report.id}-manager-resolution`,
          title: 'Resolucion pendiente de revision',
          detail: report.resolution.description,
          at: report.resolution.sentAt,
          reportId: report.id,
        });
      }

      return notifications;
    })
    .sort((a, b) => new Date(b.at) - new Date(a.at));
}

function buildUserNotifications(reports, user) {
  if (!user?.id) return [];

  if (user.role === 'operador') {
    return buildOperatorNotifications(reports, user.id);
  }

  if (user.role === 'gestor' || user.role === 'admin') {
    return buildManagerNotifications(reports);
  }

  return reports
    .flatMap((report) => {
      if (String(report.createdBy) !== String(user.id)) return [];

      const notifications = [
        {
          id: `${report.id}-created`,
          title: 'Reporte creado',
          detail: report.title,
          at: report.createdAt,
          reportId: report.id,
        },
      ];

      if (report.assignedTo) {
        notifications.push({
          id: `${report.id}-assigned-to-operator`,
          title: 'Reporte asignado',
          detail: report.title,
          at: report.assignedAt ?? report.createdAt,
          reportId: report.id,
        });
      }

      if (report.resolution) {
        notifications.push({
          id: `${report.id}-resolved`,
          title: 'Resolucion registrada',
          detail: report.resolution.description,
          at: report.resolution.sentAt,
          reportId: report.id,
        });
      }

      return notifications;
    })
    .sort((a, b) => new Date(b.at) - new Date(a.at));
}

export const ReportsProvider = ({ children }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState(readReports);

  const userReports = useMemo(
    () => reports.filter((report) => String(report.createdBy) === String(user?.id)),
    [reports, user?.id]
  );

  const operatorAssignedReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          String(report.assignedTo) === String(user?.id) &&
          !report.resolution &&
          report.statusId !== 'cerrado' &&
          report.statusId !== 'rechazado'
      ),
    [reports, user?.id]
  );

  const operatorResolvedReports = useMemo(
    () => reports.filter((report) => String(report.assignedTo) === String(user?.id) && report.resolution),
    [reports, user?.id]
  );

  const operatorNotifications = useMemo(
    () => buildOperatorNotifications(reports, user?.id),
    [reports, user?.id]
  );

  const notifications = useMemo(
    () => buildUserNotifications(reports, user),
    [reports, user]
  );

  const addReport = useCallback(async (formData, userId) => {
    const report = buildReport(formData, userId);

    setReports((prev) => {
      const nextReports = [report, ...prev];
      saveReports(nextReports);
      return nextReports;
    });

    return report;
  }, []);

  const deleteReport = useCallback((reportId) => {
    setReports((prev) => {
      const nextReports = prev.filter(
        (report) => !(report.id === reportId && report.statusId === 'pendiente')
      );
      saveReports(nextReports);
      return nextReports;
    });
  }, []);

  const submitResolution = useCallback((reportId, resolutionData, operatorId) => {
    let updatedReport = null;

    setReports((prev) => {
      const nextReports = prev.map((report) => {
        if (report.id !== reportId || String(report.assignedTo) !== String(operatorId)) {
          return report;
        }

        updatedReport = {
          ...report,
          statusId: 'resuelto',
          resolution: {
            id: `res-${Date.now()}`,
            description: resolutionData.description.trim(),
            evidences: resolutionData.evidences ?? [],
            reviewStatusId: 'enviada',
            qualityId: null,
            resolutionMethod: '',
            sentAt: new Date().toISOString(),
            feedback: '',
          },
          history: [
            ...(report.history ?? []),
            {
              statusId: 'resuelto',
              at: new Date().toISOString(),
              by: operatorId,
              note: 'Resolucion enviada por el operador.',
            },
          ],
        };

        return updatedReport;
      });

      saveReports(nextReports);
      return nextReports;
    });

    return updatedReport;
  }, []);

  return (
    <ReportsContext.Provider
      value={{
        reports: userReports,
        allReports: reports,
        operatorAssignedReports,
        operatorResolvedReports,
        operatorNotifications,
        notifications,
        addReport,
        deleteReport,
        submitResolution,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports debe ser usado dentro de ReportsProvider');
  return context;
};
