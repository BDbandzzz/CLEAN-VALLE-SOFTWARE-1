import { REPORT_STORAGE_BUCKETS } from '@/core/constants/domainConstants';
import { createId } from '@/core/lib/createId';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';
import { supabase } from '@/services/supabaseClient';

const SIGNED_URL_TTL_SECONDS = 60 * 60;
const SIGNED_URL_CACHE_TTL = 55 * 60 * 1000;
const SIGNED_URL_CACHE_KEY = 'cleanvalle_signed_report_urls_v1';

let signedUrlCacheMemory = null;

function readSignedUrlCache() {
  if (signedUrlCacheMemory) return signedUrlCacheMemory;

  try {
    signedUrlCacheMemory =
      JSON.parse(sessionStorage.getItem(SIGNED_URL_CACHE_KEY)) ?? {};
  } catch {
    signedUrlCacheMemory = {};
  }

  return signedUrlCacheMemory;
}

function persistSignedUrlCache(cache) {
  signedUrlCacheMemory = cache;

  try {
    sessionStorage.setItem(SIGNED_URL_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // La cache en memoria sigue disponible durante la sesion actual.
  }
}

function getCachedSignedUrls(bucket, paths) {
  const cache = readSignedUrlCache();
  const now = Date.now();
  const urls = new Map();
  const missingPaths = [];

  for (const path of paths) {
    const cached = cache[`${bucket}:${path}`];
    if (cached?.url && cached.expiresAt > now) {
      urls.set(path, cached.url);
    } else {
      missingPaths.push(path);
    }
  }

  return { cache, urls, missingPaths };
}

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
      const path = `${parentId}/${createId()}.${getFileExtension(file)}`;
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
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.storage.upload);
  }
}

async function createSignedUrlLookup(bucket, paths = []) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (!uniquePaths.length) return new Map();
  const { cache, urls, missingPaths } = getCachedSignedUrls(
    bucket,
    uniquePaths
  );

  if (!missingPaths.length) return urls;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(missingPaths, SIGNED_URL_TTL_SECONDS);

  if (error) {
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.storage.read);
  }

  (data ?? []).forEach((item, index) => {
    const path = item.path ?? missingPaths[index];
    if (!item.signedUrl) return;

    urls.set(path, item.signedUrl);
    cache[`${bucket}:${path}`] = {
      url: item.signedUrl,
      expiresAt: Date.now() + SIGNED_URL_CACHE_TTL,
    };
  });
  persistSignedUrlCache(cache);

  return urls;
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
