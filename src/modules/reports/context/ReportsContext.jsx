/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { API_BASE_URL } from '@/core/constants/api';
import { useAuth } from '@/core/context/AuthContext';
import { useCatalogs } from '@/core/context/CatalogContext';
import { findStatusOptionByKey, getStatusMeta } from '@/modules/reports/constants/reportConstants';

const ReportsContext = createContext();
const CURRENT_TOKEN_KEY = 'auth_token';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function getUserCode(value) {
  if (!value || typeof value !== 'object') return value;
  return pickFirst(value.codeUser, value.id, value.operatorId, value.studentCode, value.adminId);
}

function parseOccurredAt(occurredAt) {
  if (!occurredAt) return null;
  if (Array.isArray(occurredAt)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = occurredAt;
    return new Date(year, month - 1, day, hour, minute, second);
  }

  return new Date(occurredAt);
}

function toDateInputValue(value) {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00`;
  }
  return value;
}

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const { user } = useAuth();
  const { findOption, getOptions, getPayloadId } = useCatalogs();

  const getStatusPayloadId = useCallback(
    (statusKey) => {
      const option = findStatusOptionByKey(statusKey, getOptions('statusReport'));
      return option?.value ?? null;
    },
    [getOptions]
  );

  const buildStatusPatch = useCallback(
    (statusKey) => {
      const statusOptions = getOptions('statusReport');
      const payloadId = getStatusPayloadId(statusKey);
      const meta = getStatusMeta(payloadId ?? statusKey, statusOptions);

      return {
        statusId: payloadId,
        status: meta.label,
        statusKey: meta.key,
      };
    },
    [getOptions, getStatusPayloadId]
  );

  const mapReportResponse = useCallback(
    (data) => {
      const source = Array.isArray(data) ? data : [data].filter(Boolean);
      const statusOptions = getOptions('statusReport');

      return source.map((report) => {
        const typeValue = pickFirst(report.idType, report.typeReport);
        const riskValue = pickFirst(report.idRisk, report.riskLevel);
        const statusValue = pickFirst(report.idStatus, report.statusReport);
        const typeOption = findOption('typeReport', typeValue);
        const riskOption = findOption('riskLevel', riskValue);
        const statusOption = findOption('statusReport', statusValue);
        const statusMeta = getStatusMeta(statusOption?.id ?? statusValue, statusOptions);

        return {
          ...report,
          id: pickFirst(report.idReport, report.reportId, report.id),
          incidentDate: parseOccurredAt(report.occurredAt ?? report.incidentDate),
          reportType: typeOption?.id ?? String(typeValue ?? ''),
          reportTypeLabel: typeOption?.label ?? String(typeValue ?? ''),
          riskLevel: riskOption?.id ?? String(riskValue ?? ''),
          riskLevelLabel: riskOption?.label ?? String(riskValue ?? ''),
          statusId: statusOption?.value ?? statusOption?.id ?? statusValue,
          status: statusMeta.label,
          statusKey: statusMeta.key,
          createdBy: getUserCode(pickFirst(report.studentCode, report.student, report.createdBy, report.user)),
          operatorId: getUserCode(pickFirst(report.operatorId, report.operatorCode, report.operator)),
          operatorName: pickFirst(
            report.operatorName,
            report.operator?.name,
            [report.operator?.firstName, report.operator?.lastName].filter(Boolean).join(' ')
          ),
          images: report.images ?? report.imageUrls ?? report.evidenceImages ?? [],
        };
      });
    },
    [findOption, getOptions]
  );

  const fetchReports = useCallback(
    async (userId, role) => {
      try {
        const token = localStorage.getItem(CURRENT_TOKEN_KEY);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        let endpoint = `${API_BASE_URL}/api/reports`;

        if (role === 'estudiante' || role === 'profesor') {
          endpoint = `${API_BASE_URL}/api/reports/student/${userId}`;
        }

        const res = await fetch(endpoint, { headers });
        if (!res.ok) {
          console.error('Fetch reports failed with status', res.status);
          return;
        }

        const data = await res.json();
        setReports(mapReportResponse(data));
      } catch (error) {
        console.error('Error fetching reports', error);
      }
    },
    [mapReportResponse]
  );

  useEffect(() => {
    if (user?.id && user?.role) {
      Promise.resolve().then(() => fetchReports(user.id, user.role));
    }
  }, [user, fetchReports]);

  const addReport = useCallback(
    async (reportData, userId) => {
      try {
        const token = localStorage.getItem(CURRENT_TOKEN_KEY);
        const riskLevelId = getPayloadId('riskLevel', reportData.riskLevel);
        const typeReportId = getPayloadId('typeReport', reportData.reportType);
        const statusReportId = getStatusPayloadId('submitted');

        if (riskLevelId === null || typeReportId === null || statusReportId === null) {
          console.error('No se pudo crear el reporte: catalogos incompletos o seleccion invalida');
          return null;
        }

        const payload = {
          title: reportData.title,
          description: reportData.description,
          location: reportData.location,
          riskLevelId,
          typeReportId,
          statusReportId,
          occurredAt: reportData.incidentDate ? toDateInputValue(reportData.incidentDate) : new Date().toISOString(),
          studentCode: userId,
        };

        const res = await fetch(`${API_BASE_URL}/api/reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.text();
          console.error('Error adding report:', err);
          return null;
        }

        const newReport = await res.json();
        const mapped = mapReportResponse(newReport)[0];
        setReports((prev) => [mapped, ...prev]);
        return mapped;
      } catch (error) {
        console.error('Error adding report', error);
        return null;
      }
    },
    [getPayloadId, getStatusPayloadId, mapReportResponse]
  );

  const getUserReports = useCallback(
    (userId) => reports.filter((report) => !userId || String(report.createdBy) === String(userId) || report.createdBy === undefined),
    [reports]
  );

  const getResolvedReports = useCallback(
    () => reports.filter((report) => report.statusKey === 'resolved'),
    [reports]
  );

  const assignReport = useCallback(
    async (reportId, operator, adminId) => {
      try {
        const token = localStorage.getItem(CURRENT_TOKEN_KEY);
        const operatorId = pickFirst(operator.id, operator.codeUser, operator.operatorId);
        const payload = {
          idReport: { idReport: reportId },
          operatorId: { codeUser: operatorId },
          adminId: { codeUser: adminId },
          isActive: true,
        };

        const res = await fetch(`${API_BASE_URL}/api/assignation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const statusPatch = buildStatusPatch('inProgress');
          setReports((prev) =>
            prev.map((report) =>
              report.id === reportId
                ? { ...report, ...statusPatch, operatorId, operatorName: operator.name }
                : report
            )
          );
        }
      } catch (error) {
        console.error('Error assigning report', error);
      }
    },
    [buildStatusPatch]
  );

  const discardReport = useCallback(
    async (reportId) => {
      try {
        const token = localStorage.getItem(CURRENT_TOKEN_KEY);
        const statusReportId = getStatusPayloadId('discarded');
        if (statusReportId === null) {
          console.error('No se pudo descartar el reporte: estado no encontrado en catalogos');
          return;
        }

        const payload = { statusReportId };

        const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const statusPatch = buildStatusPatch('discarded');
          setReports((prev) =>
            prev.map((report) => (report.id === reportId ? { ...report, ...statusPatch } : report))
          );
        }
      } catch (error) {
        console.error('Error discarding report', error);
      }
    },
    [buildStatusPatch, getStatusPayloadId]
  );

  const evaluateResolution = useCallback(
    async (reportId, isValid) => {
      try {
        const token = localStorage.getItem(CURRENT_TOKEN_KEY);
        const nextStatusKey = isValid ? 'closed' : 'inProgress';
        const statusReportId = getStatusPayloadId(nextStatusKey);
        if (statusReportId === null) {
          console.error('No se pudo evaluar el reporte: estado no encontrado en catalogos');
          return;
        }

        const payload = { statusReportId };

        const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const statusPatch = buildStatusPatch(nextStatusKey);
          setReports((prev) =>
            prev.map((report) => (report.id === reportId ? { ...report, ...statusPatch } : report))
          );
        }
      } catch (error) {
        console.error('Error evaluating report resolution', error);
      }
    },
    [buildStatusPatch, getStatusPayloadId]
  );

  const getAssignedReportsToOperator = useCallback(
    (operatorId) =>
      reports.filter(
        (report) => String(report.operatorId) === String(operatorId) && report.statusKey === 'inProgress'
      ),
    [reports]
  );

  const getResolvedReportsByOperator = useCallback(
    (operatorId) =>
      reports.filter(
        (report) =>
          String(report.operatorId) === String(operatorId) &&
          (report.statusKey === 'resolved' || report.statusKey === 'closed')
      ),
    [reports]
  );

  const submitResolution = useCallback(
    async (reportId, resolutionData) => {
      try {
        const statusPatch = buildStatusPatch('resolved');
        setReports((prev) =>
          prev.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  ...statusPatch,
                  resolution: resolutionData.description,
                  resolutionImages: resolutionData.images,
                  resolvedAt: resolutionData.date || new Date().toISOString(),
                }
              : report
          )
        );
        return true;
      } catch (error) {
        console.error('Error submitting resolution', error);
        return false;
      }
    },
    [buildStatusPatch]
  );

  return (
    <ReportsContext.Provider value={{
      reports,
      addReport,
      getUserReports,
      getResolvedReports,
      getAssignedReportsToOperator,
      getResolvedReportsByOperator,
      assignReport,
      discardReport,
      evaluateResolution,
      submitResolution,
      fetchReports,
    }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports debe ser usado dentro de ReportsProvider');
  return context;
};
