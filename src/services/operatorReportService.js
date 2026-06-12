import {
  getResolutionPhotoUrls,
  hydrateReportsMedia,
  uploadResolutionPhotos,
} from '@/services/reportStorageService';
import { supabase } from '@/services/supabaseClient';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';

async function registerResolutionPhotos(resolutionId, paths) {
  for (const path of paths) {
    const { error } = await supabase.rpc('register_resolution_photo', {
      p_id_resolution: resolutionId,
      p_file_path: path,
    });
    if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.operator.photos);
  }
}

export async function getOperatorReportDashboard() {
  const { data, error } = await supabase.rpc('operator_report_dashboard');
  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.operator.dashboard);

  const [assigned, groupAssignments, resolutions] = await Promise.all([
    hydrateReportsMedia(data?.assigned ?? []),
    hydrateOperatorGroups(data?.groupAssignments ?? []),
    hydrateOperatorItems(data?.resolutions ?? []),
  ]);

  return {
    assigned,
    groupAssignments,
    resolutions,
    metrics: data?.metrics ?? {},
  };
}

export async function submitOperatorResolution(sourceType, sourceId, values) {
  const resolvedAt = values.resolvedAt
    ? new Date(`${values.resolvedAt}T12:00:00`).toISOString()
    : new Date().toISOString();

  const rpcName =
    sourceType === 'group' ? 'submit_group_resolution' : 'submit_resolution';
  const sourceParameter =
    sourceType === 'group'
      ? { p_id_group: Number(sourceId) }
      : { p_id_report: Number(sourceId) };

  const { data: resolutionId, error } = await supabase.rpc(rpcName, {
    ...sourceParameter,
    p_description: values.description.trim(),
    p_method: values.method.trim(),
    p_resolved_at: resolvedAt,
  });

  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.operator.resolution);

  const paths = await uploadResolutionPhotos(resolutionId, values.images ?? []);
  await registerResolutionPhotos(resolutionId, paths);
  return { id: resolutionId };
}

export async function rejectOperatorAssignment(sourceType, sourceId, reason) {
  const rpcName =
    sourceType === 'group' ? 'reject_group_assignment' : 'reject_assignment';
  const sourceParameter =
    sourceType === 'group'
      ? { p_id_group: Number(sourceId) }
      : { p_id_report: Number(sourceId) };

  const { error } = await supabase.rpc(rpcName, {
    ...sourceParameter,
    p_reason: reason.trim(),
  });

  if (error) throw createServiceError(error, SERVICE_ERROR_MESSAGES.operator.reject);
}

async function hydrateOperatorGroups(groups) {
  return Promise.all(groups.map(hydrateOperatorGroup));
}

async function hydrateOperatorItems(items) {
  const reportItems = items.filter((item) => item.sourceType !== 'group');
  const groupItems = items.filter((item) => item.sourceType === 'group');
  const [reports, groups] = await Promise.all([
    hydrateReportsMedia(reportItems),
    hydrateOperatorGroups(groupItems),
  ]);
  return [...reports, ...groups].sort(
    (a, b) =>
      new Date(b.resolution?.resolvedAt ?? b.createdAt ?? 0) -
      new Date(a.resolution?.resolvedAt ?? a.createdAt ?? 0)
  );
}

async function hydrateOperatorGroup(group) {
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
