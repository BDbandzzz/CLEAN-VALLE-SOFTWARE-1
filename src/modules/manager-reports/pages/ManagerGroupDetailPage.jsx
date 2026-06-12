import { ArrowLeft, Layers3, ListPlus, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { showErrorAlert, showSuccessAlert } from '@/core/services/alertService';
import { AddReportsToGroupDialog } from '@/modules/manager-reports/components/AddReportsToGroupDialog';
import { AssignmentHistory } from '@/modules/manager-reports/components/AssignmentHistory';
import { GroupReportsMetadataDialog } from '@/modules/manager-reports/components/GroupReportsMetadataDialog';
import { OperatorAssignmentPanel } from '@/modules/manager-reports/components/OperatorAssignmentPanel';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { ReportStatusPill } from '@/modules/reports/components/ReportStatusPill';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';
import {
  addReportsToGroup,
  assignReportGroup,
  getAvailableOperatorsForGroup,
  getGroupableReports,
  getManagerReportGroupDetail,
  updateGroupReportsMetadata,
} from '@/services/managerReportService';

const EMPTY_METADATA = {
  statusId: '',
  riskLevelId: '',
  localizationId: '',
  subareaId: '',
};

export default function ManagerGroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [operators, setOperators] = useState([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmAssignment, setConfirmAssignment] = useState(false);
  const [showAddReports, setShowAddReports] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [groupableReports, setGroupableReports] = useState([]);
  const [selectedReportIds, setSelectedReportIds] = useState([]);
  const [metadata, setMetadata] = useState(EMPTY_METADATA);
  const {
    riskLevels,
    reportStatuses,
    localizations,
    subareasByLocalization,
  } = useReportCatalogs();

  const loadGroup = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextGroup = await getManagerReportGroupDetail(groupId);
      setGroup(nextGroup);
      const hasBlockingAssignment = nextGroup.assignments?.some((assignment) =>
        [ELEMENT_STATE_IDS.ACTIVE, ELEMENT_STATE_IDS.CLOSED].includes(
          Number(assignment.stateId)
        )
      );
      setOperators(
        hasBlockingAssignment
          ? []
          : await getAvailableOperatorsForGroup(nextGroup.id)
      );
    } catch (error) {
      showErrorAlert(error, {
        title: 'No fue posible cargar el grupo',
      });
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const saveAssignment = async () => {
    setIsSaving(true);
    try {
      await assignReportGroup(group.id, selectedOperatorId, notes);
      showSuccessAlert('El grupo fue asignado correctamente.');
      setConfirmAssignment(false);
      setSelectedOperatorId('');
      setNotes('');
      await loadGroup();
    } catch (error) {
      showErrorAlert(error);
    } finally {
      setIsSaving(false);
    }
  };

  const openAddReports = async () => {
    setIsLoading(true);
    try {
      setGroupableReports(await getGroupableReports(group.id));
      setSelectedReportIds([]);
      setShowAddReports(true);
    } catch (error) {
      showErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddedReports = async () => {
    setIsSaving(true);
    try {
      await addReportsToGroup(group.id, selectedReportIds);
      showSuccessAlert('Los reportes fueron añadidos al grupo.');
      setShowAddReports(false);
      setSelectedReportIds([]);
      await loadGroup();
    } catch (error) {
      showErrorAlert(error);
    } finally {
      setIsSaving(false);
    }
  };

  const openMetadata = () => {
    const reports = group.reports ?? [];
    setMetadata({
      statusId: getSharedValue(reports, 'statusId'),
      riskLevelId: getSharedValue(reports, 'riskLevelId'),
      localizationId: getSharedValue(reports, 'localizationId'),
      subareaId: getSharedValue(reports, 'subareaId'),
    });
    setShowMetadata(true);
  };

  const saveMetadata = async () => {
    setIsSaving(true);
    try {
      const updatedGroup = await updateGroupReportsMetadata(group.id, metadata);
      setGroup(updatedGroup);
      setShowMetadata(false);
      showSuccessAlert('Todos los reportes del grupo fueron actualizados.');
    } catch (error) {
      showErrorAlert(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !group) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Cargando grupo...
      </div>
    );
  }

  if (!group) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Button variant="outline" onClick={() => navigate('/manager/groups')}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
        <p className="rounded-lg bg-card p-6 text-center text-muted-foreground shadow-sm">
          No fue posible encontrar el grupo.
        </p>
      </div>
    );
  }

  const blockingAssignment = group.assignments?.some((assignment) =>
    [ELEMENT_STATE_IDS.ACTIVE, ELEMENT_STATE_IDS.CLOSED].includes(
      Number(assignment.stateId)
    )
  );
  const selectedOperator = operators.find(
    (operator) => operator.authId === selectedOperatorId
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <Button variant="outline" onClick={() => navigate('/manager/groups')}>
        <ArrowLeft className="size-4" />
        Volver a grupos
      </Button>

      <ModuleHero
        icon={<Layers3 />}
        title={group.title}
        description={
          group.description ||
          'Grupo de reportes relacionados para una atención conjunta.'
        }
        size="compact"
        variant="surface"
        className="border-primary/15 bg-emerald-50/70"
        aside={
          <ReportBadge
            type="category"
            label={group.categoryName}
            color={group.categoryColor}
          />
        }
      />

      <section className="rounded-lg bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Reportes incluidos
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {group.reports?.length ?? 0} reportes vinculados a este grupo.
            </p>
          </div>
          {!blockingAssignment && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={openMetadata}>
                <SlidersHorizontal className="size-4" />
                Editar todos
              </Button>
              <Button type="button" onClick={openAddReports}>
                <ListPlus className="size-4" />
                Añadir reportes
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Reporte</th>
                <th className="px-4 py-3">Razón</th>
                <th className="px-4 py-3">Riesgo</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {group.reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-4 py-3 font-medium">{report.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {report.subtypeName}
                  </td>
                  <td className="px-4 py-3">
                    <ReportBadge
                      type="risk"
                      label={report.riskLevelName}
                      color={report.riskLevelColor}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ReportStatusPill
                      meta={{
                        id: report.statusId,
                        label: report.statusName,
                        color: report.statusColor,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="overflow-hidden rounded-lg bg-card shadow-sm">
        <OperatorAssignmentPanel
          operators={operators}
          selectedOperatorId={selectedOperatorId}
          notes={notes}
          disabled={blockingAssignment}
          isLoading={isLoading}
          categoryLabel={group.categoryName}
          subtypeLabel="Todas las razones del grupo"
          onSelect={setSelectedOperatorId}
          onNotesChange={setNotes}
          onAssign={() => setConfirmAssignment(true)}
        />
      </div>

      <AssignmentHistory assignments={group.assignments} />

      <ConfirmationMessage
        open={confirmAssignment}
        {...CONFIRMATION_MESSAGES.reports.assignGroup(
          selectedOperator
            ? `${selectedOperator.firstName} ${selectedOperator.lastName}`
            : ''
        )}
        isLoading={isSaving}
        onAccept={saveAssignment}
        onReject={() => setConfirmAssignment(false)}
      />

      <AddReportsToGroupDialog
        open={showAddReports}
        reports={groupableReports}
        selectedIds={selectedReportIds}
        isLoading={isSaving}
        onToggle={(reportId) =>
          setSelectedReportIds((current) =>
            current.includes(reportId)
              ? current.filter((id) => id !== reportId)
              : [...current, reportId]
          )
        }
        onConfirm={saveAddedReports}
        onClose={() => setShowAddReports(false)}
      />

      <GroupReportsMetadataDialog
        open={showMetadata}
        values={metadata}
        statuses={reportStatuses.filter((status) => !status.isTerminal)}
        riskLevels={riskLevels}
        localizations={localizations}
        subareas={subareasByLocalization?.[metadata.localizationId] ?? []}
        isLoading={isSaving}
        onChange={(field, value) =>
          setMetadata((current) => ({ ...current, [field]: value }))
        }
        onLocalizationChange={(localizationId) =>
          setMetadata((current) => ({
            ...current,
            localizationId,
            subareaId: '',
          }))
        }
        onConfirm={saveMetadata}
        onClose={() => setShowMetadata(false)}
      />
    </div>
  );
}

function getSharedValue(items, field) {
  const values = [...new Set(items.map((item) => String(item[field] ?? '')))];
  return values.length === 1 ? values[0] : '';
}
