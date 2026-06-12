import { hydrateReportsMedia, uploadReportPhotos } from '@/services/reportStorageService';
import { supabase } from '@/services/supabaseClient';

function toOccurredAt(date) {
  if (!date) return null;
  return new Date(`${date}T12:00:00`).toISOString();
}

async function registerReportPhotos(reportId, paths) {
  for (const path of paths) {
    const { error } = await supabase.rpc('register_report_photo', {
      p_id_report: reportId,
      p_file_path: path,
    });
    if (error) throw new Error(error.message);
  }
}

export async function createReport(formData) {
  const { data: reportId, error } = await supabase.rpc('create_report', {
    p_title: formData.title.trim(),
    p_description: formData.description.trim(),
    p_risk_id: Number(formData.riskLevelId),
    p_id_subtype: Number(formData.subtypeId),
    p_id_subarea: formData.subareaId ? Number(formData.subareaId) : null,
    p_occurred_at: toOccurredAt(formData.incidentDate),
    p_context_report: formData.customContext?.trim() ?? '',
  });

  if (error) throw new Error(error.message);

  const paths = await uploadReportPhotos(reportId, formData.images ?? []);
  await registerReportPhotos(reportId, paths);
  return { id: reportId };
}

export async function getMyReports() {
  const { data, error } = await supabase.rpc('list_my_reports');
  if (error) throw new Error(error.message);
  return hydrateReportsMedia(data ?? []);
}

export async function getResolvedReports() {
  const { data, error } = await supabase.rpc('list_resolved_reports');
  if (error) throw new Error(error.message);
  return hydrateReportsMedia(data ?? []);
}
