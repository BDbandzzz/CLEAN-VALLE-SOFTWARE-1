import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ALERT_MESSAGES } from '@/core/constants/alertMessages';
import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { AssignmentHistory } from '@/modules/manager-reports/components/AssignmentHistory';
import { ManagerReportOverview } from '@/modules/manager-reports/components/ManagerReportOverview';
import { OperatorAssignmentPanel } from '@/modules/manager-reports/components/OperatorAssignmentPanel';
import { ReportMetadataForm } from '@/modules/manager-reports/components/ReportMetadataForm';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';
import {
  assignReport,
  discardReport,
  getAvailableOperators,
  getManagerReportDetail,
  updateReportMetadata,
} from '@/services/managerReportService';
import {
  showErrorAlert,
  showSuccessAlert,
  showWarningAlert,
} from '@/core/services/alertService';

const DETAIL_VIEWS = {
  review: 'review',
  assignment: 'assignment',
  history: 'history',
};

function reportHasBlockingAssignment(report) {
  return Boolean(report?.activeGroup) ||
    (report?.assignments ?? []).some((assignment) =>
      [ELEMENT_STATE_IDS.ACTIVE, ELEMENT_STATE_IDS.CLOSED].includes(
        Number(assignment.stateId)
      )
    );
}

export default function ManagerReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const catalogs = useReportCatalogs();
  const { loadSubareas, loadSubtypes } = catalogs;
  const [report, setReport] = useState(null);
  const [form, setForm] = useState(null);
  const [operators, setOperators] = useState([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingAction, setPendingAction] = useState('');
  const [activeView, setActiveView] = useState(DETAIL_VIEWS.review);

  const hasBlockingAssignment = reportHasBlockingAssignment(report);
  const assignmentDisabled = Boolean(report?.statusTerminal || hasBlockingAssignment);
  const discardDisabled = Boolean(report?.statusTerminal || hasBlockingAssignment);

  const loadOperators = useCallback(async (reportIdToLoad) => {
    if (!reportIdToLoad) {
      setOperators([]);
      return [];
    }

    setIsLoadingOperators(true);
    try {
      const nextOperators = await getAvailableOperators(reportIdToLoad);
      setOperators(nextOperators);
      return nextOperators;
    } catch (loadError) {
      setOperators([]);
      setError(loadError.message);
      showErrorAlert(loadError, { title: 'No fue posible cargar los operadores' });
      return [];
    } finally {
      setIsLoadingOperators(false);
    }
  }, []);

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const nextReport = await getManagerReportDetail(reportId);
      setReport(nextReport);
      setActiveView(
        reportHasBlockingAssignment(nextReport)
          ? DETAIL_VIEWS.history
          : DETAIL_VIEWS.review
      );
      setForm({
        riskLevelId: String(nextReport.riskLevelId ?? ''),
        categoryId: String(nextReport.categoryId ?? ''),
        subtypeId: String(nextReport.subtypeId ?? ''),
        localizationId: String(nextReport.localizationId ?? ''),
        subareaId: String(nextReport.subareaId ?? ''),
      });
      return nextReport;
    } catch (loadError) {
      setError(loadError.message);
      showErrorAlert(loadError, { title: 'No fue posible cargar el reporte' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (report?.categoryId) {
      loadSubtypes(String(report.categoryId));
    }
    if (report?.localizationId) {
      loadSubareas(String(report.localizationId));
    }
  }, [loadSubareas, loadSubtypes, report?.categoryId, report?.localizationId]);

  useEffect(() => {
    if (!report || assignmentDisabled) {
      setOperators([]);
      return;
    }

    loadOperators(report.id);
  }, [assignmentDisabled, loadOperators, report]);

  const changeCategory = async (categoryId) => {
    setForm((current) => ({ ...current, categoryId, subtypeId: '' }));
    setOperators([]);
    setSelectedOperatorId('');
    if (categoryId) await loadSubtypes(categoryId);
  };

  const changeSubtype = (subtypeId) => {
    setForm((current) => ({ ...current, subtypeId }));
    setOperators([]);
    setSelectedOperatorId('');
    setSuccess('');

    if (!subtypeId) return;

    const classificationDidNotChange =
      String(report.categoryId ?? '') === form.categoryId &&
      String(report.subtypeId ?? '') === String(subtypeId);

    if (classificationDidNotChange) {
      loadOperators(report.id);
      return;
    }

    setPendingAction('classification');
  };

  const changeLocalization = async (localizationId) => {
    setForm((current) => ({ ...current, localizationId, subareaId: '' }));
    if (localizationId) await loadSubareas(localizationId);
  };

  const saveMetadata = async () => {
    if (!form.riskLevelId || !form.subtypeId) {
      const message = 'Selecciona el nivel de riesgo y la razón del reporte.';
      setError(message);
      showWarningAlert(message);
      setPendingAction('');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await updateReportMetadata(report.id, form);
      const nextReport = await loadDetail();
      if (nextReport && !assignmentDisabled) {
        await loadOperators(nextReport.id);
      }
      setSuccess(
        pendingAction === 'classification'
          ? 'Clasificación actualizada. Los operadores compatibles ya están disponibles.'
          : 'La clasificación del reporte fue actualizada.'
      );
      showSuccessAlert('La clasificación del reporte fue actualizada.');
      setPendingAction('');
    } catch (saveError) {
      setError(saveError.message);
      showErrorAlert(saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmAssignment = async () => {
    setIsSaving(true);
    setError('');
    try {
      await assignReport(report.id, selectedOperatorId, assignmentNotes);
      await loadDetail();
      setSuccess('El reporte fue asignado correctamente.');
      showSuccessAlert(ALERT_MESSAGES.reports.assigned);
      setSelectedOperatorId('');
      setAssignmentNotes('');
      setPendingAction('');
    } catch (assignError) {
      setError(assignError.message);
      showErrorAlert(assignError);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelClassification = async () => {
    setPendingAction('');
    setForm((current) => ({
      ...current,
      categoryId: String(report.categoryId ?? ''),
      subtypeId: String(report.subtypeId ?? ''),
    }));
    if (report.categoryId) await loadSubtypes(String(report.categoryId));
    if (!assignmentDisabled) await loadOperators(report.id);
  };

  const confirmDiscard = async () => {
    setIsSaving(true);
    setError('');
    try {
      await discardReport(report.id);
      await loadDetail();
      setSuccess('El reporte fue descartado y se conserva para auditoria.');
      showSuccessAlert(ALERT_MESSAGES.reports.discarded);
      setPendingAction('');
    } catch (discardError) {
      setError(discardError.message);
      showErrorAlert(discardError);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedOperator = operators.find(
    (operator) => operator.authId === selectedOperatorId
  );

  if (isLoading && !report) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Cargando reporte...</div>;
  }

  if (!report || !form) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Button variant="outline" onClick={() => navigate('/manager/reports')}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error || 'No fue posible cargar el reporte.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <Button variant="outline" onClick={() => navigate('/manager/reports')}>
        <ArrowLeft className="size-4" />
        Volver a reportes
      </Button>

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

      <ManagerReportOverview report={report} />

      <div className="sticky top-2 z-20 grid grid-cols-3 rounded-xl bg-muted/95 p-1 shadow-md backdrop-blur">
        <SegmentedTabButton
          label="Revisión"
          active={activeView === DETAIL_VIEWS.review}
          onClick={() => setActiveView(DETAIL_VIEWS.review)}
        />
        <SegmentedTabButton
          label="Asignar operador"
          mobileLabel="Asignación"
          active={activeView === DETAIL_VIEWS.assignment}
          onClick={() => setActiveView(DETAIL_VIEWS.assignment)}
        />
        <SegmentedTabButton
          label="Historial de asignaciones"
          mobileLabel="Historial"
          count={report.assignments?.length ?? 0}
          active={activeView === DETAIL_VIEWS.history}
          onClick={() => setActiveView(DETAIL_VIEWS.history)}
        />
      </div>

      {activeView === DETAIL_VIEWS.review && (
        hasBlockingAssignment ? (
          <section className="rounded-lg bg-card px-5 py-8 text-center shadow-sm sm:px-7">
            <h2 className="font-semibold text-foreground">
              Revisión finalizada
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              La clasificación no puede modificarse porque el reporte ya tiene una asignación.
              {report.activeGroup
                ? ` Pertenece al grupo "${report.activeGroup.title}".`
                : ''}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={() => setActiveView(DETAIL_VIEWS.history)}
            >
              Ver historial de asignaciones
            </Button>
          </section>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 rounded-lg bg-card px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <h2 className="font-semibold text-foreground">
                  Decisión de revisión
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Descarta el reporte si no cumple los criterios de gestión.
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                disabled={discardDisabled || isSaving}
                onClick={() => setPendingAction('discard')}
              >
                <XCircle className="size-4" />
                Descartar reporte
              </Button>
            </div>

            <div className="overflow-hidden rounded-lg bg-background shadow-sm">
              <ReportMetadataForm
                values={form}
                categories={catalogs.categories}
                subtypes={catalogs.subtypesByCategory[form.categoryId] ?? []}
                riskLevels={catalogs.riskLevels}
                localizations={catalogs.localizations}
                subareas={catalogs.subareasByLocalization[form.localizationId] ?? []}
                disabled={report.statusTerminal}
                isSaving={isSaving}
                onChange={(field, value) =>
                  setForm((current) => ({ ...current, [field]: value }))
                }
                onCategoryChange={changeCategory}
                onSubtypeChange={changeSubtype}
                onLocalizationChange={changeLocalization}
                onSubmit={() => setPendingAction('metadata')}
              />
            </div>
          </div>
        )
      )}

      {activeView === DETAIL_VIEWS.assignment && (
        <div className="overflow-hidden rounded-lg bg-card shadow-sm">
          <OperatorAssignmentPanel
            key={`${form.categoryId}-${form.subtypeId}`}
            operators={operators}
            selectedOperatorId={selectedOperatorId}
            notes={assignmentNotes}
            disabled={assignmentDisabled}
            isLoading={isLoadingOperators}
            categoryLabel={
              catalogs.categories.find(
                (category) => category.id === form.categoryId
              )?.label ?? ''
            }
            subtypeLabel={
              (catalogs.subtypesByCategory[form.categoryId] ?? []).find(
                (subtype) => subtype.id === form.subtypeId
              )?.label ?? ''
            }
            onSelect={setSelectedOperatorId}
            onNotesChange={setAssignmentNotes}
            onAssign={() => setPendingAction('assignment')}
          />
        </div>
      )}

      {activeView === DETAIL_VIEWS.history && (
        <AssignmentHistory assignments={report.assignments} />
      )}

      <ConfirmationMessage
        open={pendingAction === 'metadata'}
        {...CONFIRMATION_MESSAGES.reports.updateMetadata}
        isLoading={isSaving}
        onAccept={saveMetadata}
        onReject={() => setPendingAction('')}
      />
      <ConfirmationMessage
        open={pendingAction === 'assignment'}
        {...CONFIRMATION_MESSAGES.reports.assign(
          selectedOperator
            ? `${selectedOperator.firstName} ${selectedOperator.lastName}`
            : ''
        )}
        isLoading={isSaving}
        onAccept={confirmAssignment}
        onReject={() => setPendingAction('')}
      />
      <ConfirmationMessage
        open={pendingAction === 'classification'}
        {...CONFIRMATION_MESSAGES.reports.updateClassificationAndOperators}
        isLoading={isSaving}
        onAccept={saveMetadata}
        onReject={cancelClassification}
      />
      <ConfirmationMessage
        open={pendingAction === 'discard'}
        {...CONFIRMATION_MESSAGES.reports.discard(report.title)}
        isLoading={isSaving}
        onAccept={confirmDiscard}
        onReject={() => setPendingAction('')}
      />
    </div>
  );
}
