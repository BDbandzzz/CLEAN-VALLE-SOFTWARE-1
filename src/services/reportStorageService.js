import { REPORT_STORAGE_BUCKETS } from '@/core/constants/domainConstants';
import { supabase } from '@/services/supabaseClient';

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function getFileExtension(file) {
  const extension = file.name?.split('.').pop()?.toLowerCase();
  if (extension && /^[a-z0-9]+$/.test(extension)) return extension;

  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

async function uploadFiles(bucket, parentId, files) {
  const uploadedPaths = [];

  try {
    for (const file of files) {
      const path = `${parentId}/${crypto.randomUUID()}.${getFileExtension(file)}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

      if (error) throw error;
      uploadedPaths.push(path);
    }

    return uploadedPaths;
  } catch (error) {
    if (uploadedPaths.length) {
      await supabase.storage.from(bucket).remove(uploadedPaths);
    }
    throw new Error(error.message);
  }
}

async function createSignedUrlLookup(bucket, paths = []) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (!uniquePaths.length) return new Map();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(uniquePaths, SIGNED_URL_TTL_SECONDS);

  if (error) throw new Error(error.message);
  return new Map(
    (data ?? [])
      .map((item, index) => [item.path ?? uniquePaths[index], item.signedUrl])
      .filter(([, signedUrl]) => Boolean(signedUrl))
  );
}

export function uploadReportPhotos(reportId, files) {
  return uploadFiles(REPORT_STORAGE_BUCKETS.REPORT_PHOTOS, reportId, files);
}

export function uploadResolutionPhotos(resolutionId, files) {
  return uploadFiles(REPORT_STORAGE_BUCKETS.RESOLUTION_PHOTOS, resolutionId, files);
}

export async function getReportPhotoUrls(paths = []) {
  const urls = await createSignedUrlLookup(REPORT_STORAGE_BUCKETS.REPORT_PHOTOS, paths);
  return paths.map((path) => urls.get(path)).filter(Boolean);
}

export async function getResolutionPhotoUrls(paths = []) {
  const urls = await createSignedUrlLookup(
    REPORT_STORAGE_BUCKETS.RESOLUTION_PHOTOS,
    paths
  );
  return paths.map((path) => urls.get(path)).filter(Boolean);
}

export async function hydrateReportMedia(report) {
  if (!report) return null;
  const [hydratedReport] = await hydrateReportsMedia([report]);
  return hydratedReport;
}

export async function hydrateReportsMedia(reports = []) {
  const reportPaths = reports.flatMap((report) => report.evidencePaths ?? []);
  const resolutionPaths = reports.flatMap(
    (report) => report.resolution?.evidencePaths ?? []
  );
  const [reportUrls, resolutionUrls] = await Promise.all([
    createSignedUrlLookup(REPORT_STORAGE_BUCKETS.REPORT_PHOTOS, reportPaths),
    createSignedUrlLookup(
      REPORT_STORAGE_BUCKETS.RESOLUTION_PHOTOS,
      resolutionPaths
    ),
  ]);

  return reports.map((report) => ({
    ...report,
    evidences: (report.evidencePaths ?? [])
      .map((path) => reportUrls.get(path))
      .filter(Boolean),
    resolution: report.resolution
      ? {
          ...report.resolution,
          evidences: (report.resolution.evidencePaths ?? [])
            .map((path) => resolutionUrls.get(path))
            .filter(Boolean),
        }
      : null,
  }));
}
