import {
  getResolutionPhotoUrls,
  hydrateReportMedia,
  hydrateReportsMedia,
} from '@/services/reportStorageService';
import { supabase } from '@/services/supabaseClient';
import { REPORT_STATUS_IDS } from '@/core/constants/domainConstants';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';

export async function getManagerReportDashboard(filters = {}) {
  const { data, error } = await supabase.rpc('manager_report_dashboard', {
    p_category_id: filters.categoryId ? Number(filters.categoryId) : null,
    p_subtype_id: filters.subtypeId ? Number(filters.subtypeId) : null,
    p_risk_id: filters.riskLevelId ? Number(filters.riskLevelId) : null,
    p_status_id: filters.statusId ? Number(filters.statusId) : null,
    p_date_from: filters.dateFrom || null,
    p_date_to: filters.dateTo || null,
    p_page: filters.page ?? 1,
    p_page_size: filters.pageSize ?? 15,
  });

  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.dashboard);

  const byStatus = data?.byStatus ?? [];
  const discardedCount =
    byStatus.find(
      (status) => Number(status.id) === REPORT_STATUS_IDS.DISCARDED
    )?.count ?? 0;
  const hideDiscarded = !filters.statusId;
  const reports = hideDiscarded
    ? (data?.reports ?? []).filter(
        (report) => Number(report.statusId) !== REPORT_STATUS_IDS.DISCARDED
      )
    : data?.reports ?? [];

  return {
    ...data,
    total: hideDiscarded
      ? Math.max(0, (data?.total ?? 0) - discardedCount)
      : data?.total ?? 0,
    reports: await hydrateReportsMedia(reports),
  };
}

export async function getManagerReportDetail(reportId) {
  const { data, error } = await supabase.rpc('manager_report_detail', {
    p_id_report: Number(reportId),
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.detail);
  return hydrateReportMedia(data);
}

export async function updateReportMetadata(reportId, values) {
  const { data, error } = await supabase.rpc('update_report_metadata', {
    p_id_report: Number(reportId),
    p_risk_id: Number(values.riskLevelId),
    p_id_subtype: Number(values.subtypeId),
    p_id_subarea: values.subareaId ? Number(values.subareaId) : null,
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.metadata);
  return data;
}

export async function getAvailableOperators(reportId) {
  const { data, error } = await supabase.rpc('get_available_operators', {
    p_id_report: Number(reportId),
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.operators);
  return data ?? [];
}

export async function assignReport(reportId, operatorAuthId, notes) {
  const { data, error } = await supabase.rpc('assign_report', {
    p_id_report: Number(reportId),
    p_operator_uuid: operatorAuthId,
    p_notes: notes?.trim() || null,
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.assign);
  return data;
}

export async function discardReport(reportId) {
  const { data, error } = await supabase.rpc('discard_report', {
    p_id_report: Number(reportId),
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.discard);
  return data;
}

export async function getPendingResolutions() {
  const { data, error } = await supabase.rpc('manager_pending_resolutions');
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.resolutions);

  return Promise.all(
    (data ?? []).map(async (resolution) => {
      const [report, group, evidences] = await Promise.all([
        resolution.report
          ? hydrateReportMedia(resolution.report)
          : Promise.resolve(null),
        resolution.group
          ? hydrateReportGroup(resolution.group)
          : Promise.resolve(null),
        getResolutionPhotoUrls(resolution.evidencePaths ?? []),
      ]);

      return { ...resolution, report, group, evidences };
    })
  );
}

export async function reviewResolution(resolutionId, values) {
  const { data, error } = await supabase.rpc('review_resolution', {
    p_id_resolution: Number(resolutionId),
    p_approve: values.approve,
    p_feedback: values.feedback?.trim() || '',
    p_quality: values.qualityId ? Number(values.qualityId) : null,
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.review);
  return data;
}

export async function createReportGroup(values) {
  const { data, error } = await supabase.rpc('create_report_group', {
    p_title: values.title.trim(),
    p_description: values.description?.trim() || null,
    p_report_ids: values.reportIds.map(Number),
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.createGroup);
  return { id: data };
}

export async function getManagerReportGroups() {
  const { data, error } = await supabase.rpc('manager_report_groups');
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.groups);
  return Promise.all((data ?? []).map(hydrateReportGroup));
}

export async function getManagerReportGroupDetail(groupId) {
  const { data, error } = await supabase.rpc('manager_report_group_detail', {
    p_id_group: Number(groupId),
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.groupDetail);
  return hydrateReportGroup(data);
}

export async function getAvailableOperatorsForGroup(groupId) {
  const { data, error } = await supabase.rpc(
    'get_available_operators_for_group',
    { p_id_group: Number(groupId) }
  );
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.groupOperators);
  return data ?? [];
}

export async function assignReportGroup(groupId, operatorAuthId, notes) {
  const { data, error } = await supabase.rpc('assign_group', {
    p_id_group: Number(groupId),
    p_operator_uuid: operatorAuthId,
    p_notes: notes?.trim() || null,
  });
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.manager.assignGroup);
  return data;
}

async function hydrateReportGroup(group) {
  if (!group) return null;
  const [reports, resolutionUrls] = await Promise.all([
    hydrateReportsMedia(group.reports ?? []),
    getResolutionPhotoUrls(group.resolution?.evidencePaths ?? []),
  ]);

  return {
    ...group,
    reports,
    resolution: group.resolution
      ? { ...group.resolution, evidences: resolutionUrls }
      : null,
  };
}
