import { hydrateReportMedia, hydrateReportsMedia } from '@/services/reportStorageService';
import { supabase } from '@/services/supabaseClient';

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

  if (error) throw new Error(error.message);

  return {
    ...data,
    reports: await hydrateReportsMedia(data?.reports ?? []),
  };
}

export async function getManagerReportDetail(reportId) {
  const { data, error } = await supabase.rpc('manager_report_detail', {
    p_id_report: Number(reportId),
  });
  if (error) throw new Error(error.message);
  return hydrateReportMedia(data);
}

export async function updateReportMetadata(reportId, values) {
  const { data, error } = await supabase.rpc('update_report_metadata', {
    p_id_report: Number(reportId),
    p_risk_id: Number(values.riskLevelId),
    p_id_subtype: Number(values.subtypeId),
    p_id_subarea: values.subareaId ? Number(values.subareaId) : null,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getAvailableOperators(reportId) {
  const { data, error } = await supabase.rpc('get_available_operators', {
    p_id_report: Number(reportId),
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function assignReport(reportId, operatorAuthId, notes) {
  const { data, error } = await supabase.rpc('assign_report', {
    p_id_report: Number(reportId),
    p_operator_uuid: operatorAuthId,
    p_notes: notes?.trim() || null,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getPendingResolutions() {
  const { data, error } = await supabase.rpc('manager_pending_resolutions');
  if (error) throw new Error(error.message);

  const resolutions = data ?? [];
  const reports = await hydrateReportsMedia(
    resolutions.map((resolution) => resolution.report)
  );

  return resolutions.map((resolution, index) => ({
    ...resolution,
    report: reports[index],
    evidences: reports[index]?.resolution?.evidences ?? [],
  }));
}

export async function reviewResolution(resolutionId, values) {
  const { data, error } = await supabase.rpc('review_resolution', {
    p_id_resolution: Number(resolutionId),
    p_approve: values.approve,
    p_feedback: values.feedback?.trim() || '',
    p_quality: values.qualityId ? Number(values.qualityId) : null,
  });
  if (error) throw new Error(error.message);
  return data;
}
