import { ArrowLeft, Layers3 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { showErrorAlert, showSuccessAlert } from '@/core/services/alertService';
import { AssignmentHistory } from '@/modules/manager-reports/components/AssignmentHistory';
import { OperatorAssignmentPanel } from '@/modules/manager-reports/components/OperatorAssignmentPanel';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { ReportStatusPill } from '@/modules/reports/components/ReportStatusPill';
import {
  assignReportGroup,
  getAvailableOperatorsForGroup,
  getManagerReportGroupDetail,
} from '@/services/managerReportService';

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
        aside={
          <ReportBadge
            type="category"
            label={group.categoryName}
            color={group.categoryColor}
          />
        }
      />

      <section className="rounded-lg bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          Reportes incluidos
        </h2>
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
    </div>
  );
}
