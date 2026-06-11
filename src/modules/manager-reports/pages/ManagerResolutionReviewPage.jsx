import { useCallback, useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';

import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ResolutionReviewCard } from '@/modules/manager-reports/components/ResolutionReviewCard';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';
import {
  getPendingResolutions,
  reviewResolution,
} from '@/services/managerReportService';

export default function ManagerResolutionReviewPage() {
  const { resolutionQualities } = useReportCatalogs();
  const [resolutions, setResolutions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [pendingReview, setPendingReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadResolutions = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const nextResolutions = await getPendingResolutions();
      setResolutions(nextResolutions);
      setDrafts((current) => {
        const next = { ...current };
        nextResolutions.forEach((resolution) => {
          next[resolution.id] ??= { qualityId: '', feedback: '' };
        });
        return next;
      });
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResolutions();
  }, [loadResolutions]);

  const requestReview = (resolution, approve) => {
    const draft = drafts[resolution.id] ?? { qualityId: '', feedback: '' };
    setError('');
    setSuccess('');

    if (approve && !draft.qualityId) {
      setError('Selecciona la calidad antes de aprobar la resolucion.');
      return;
    }
    if (!approve && !draft.feedback.trim()) {
      setError('Escribe el motivo antes de descartar la resolucion.');
      return;
    }

    setPendingReview({ resolution, approve, draft });
  };

  const confirmReview = async () => {
    if (!pendingReview) return;
    setIsReviewing(true);
    setError('');

    try {
      await reviewResolution(pendingReview.resolution.id, {
        approve: pendingReview.approve,
        qualityId: pendingReview.draft.qualityId,
        feedback: pendingReview.draft.feedback,
      });
      setSuccess(
        pendingReview.approve
          ? 'La resolucion fue aprobada y el reporte quedo cerrado.'
          : 'La resolucion fue descartada y el operador fue notificado.'
      );
      setPendingReview(null);
      await loadResolutions();
    } catch (reviewError) {
      setError(reviewError.message);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<ClipboardCheck />}
        title="Revision de Resoluciones"
        description="Evalua las soluciones enviadas por los operadores."
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Cargando resoluciones...
        </div>
      ) : resolutions.length ? (
        <div className="space-y-5">
          {resolutions.map((resolution) => (
            <ResolutionReviewCard
              key={resolution.id}
              resolution={resolution}
              qualities={resolutionQualities}
              draft={drafts[resolution.id] ?? { qualityId: '', feedback: '' }}
              disabled={isReviewing}
              onChange={(partial) =>
                setDrafts((current) => ({
                  ...current,
                  [resolution.id]: {
                    ...(current[resolution.id] ?? { qualityId: '', feedback: '' }),
                    ...partial,
                  },
                }))
              }
              onRequestReview={(approve) => requestReview(resolution, approve)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No hay resoluciones pendientes de revision." />
      )}

      <ConfirmationMessage
        open={Boolean(pendingReview)}
        {...(pendingReview?.approve
          ? CONFIRMATION_MESSAGES.reports.approveResolution
          : CONFIRMATION_MESSAGES.reports.rejectResolution)}
        isLoading={isReviewing}
        onAccept={confirmReview}
        onReject={() => setPendingReview(null)}
      />
    </div>
  );
}
