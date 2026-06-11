import {
  hydrateReportsMedia,
  uploadResolutionPhotos,
} from '@/services/reportStorageService';
import { supabase } from '@/services/supabaseClient';

async function registerResolutionPhotos(resolutionId, paths) {
  for (const path of paths) {
    const { error } = await supabase.rpc('register_resolution_photo', {
      p_id_resolution: resolutionId,
      p_file_path: path,
    });
    if (error) throw new Error(error.message);
  }
}

export async function getOperatorReportDashboard() {
  const { data, error } = await supabase.rpc('operator_report_dashboard');
  if (error) throw new Error(error.message);

  const [assigned, resolutions] = await Promise.all([
    hydrateReportsMedia(data?.assigned ?? []),
    hydrateReportsMedia(data?.resolutions ?? []),
  ]);

  return { assigned, resolutions };
}

export async function submitReportResolution(reportId, values) {
  const resolvedAt = values.resolvedAt
    ? new Date(`${values.resolvedAt}T12:00:00`).toISOString()
    : new Date().toISOString();

  const { data: resolutionId, error } = await supabase.rpc('submit_resolution', {
    p_id_report: Number(reportId),
    p_description: values.description.trim(),
    p_method: values.method.trim(),
    p_resolved_at: resolvedAt,
  });

  if (error) throw new Error(error.message);

  const paths = await uploadResolutionPhotos(resolutionId, values.images ?? []);
  await registerResolutionPhotos(resolutionId, paths);
  return { id: resolutionId };
}
