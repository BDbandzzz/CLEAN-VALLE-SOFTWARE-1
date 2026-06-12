import { ClipboardList } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { showErrorAlert, showSuccessAlert, showWarningAlert } from '@/core/services/alertService';
import { OperatorAssignmentCard } from '@/modules/operator/components/OperatorAssignmentCard';
import { RejectAssignmentDialog } from '@/modules/operator/components/RejectAssignmentDialog';
import { useOperatorReports } from '@/modules/operator/hooks/useOperatorReports';

export default function OperatorAssignmentsPage() {
  const {
    assignedReports,
    assignedGroups,
    isLoading,
    rejectAssignment,
  } = useOperatorReports();
  const [pendingAssignment, setPendingAssignment] = useState(null);
  const [reason, setReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const assignments = useMemo(
    () =>
      [...assignedReports, ...assignedGroups].sort(
        (a, b) =>
          new Date(b.assignment?.assignedAt ?? 0) -
          new Date(a.assignment?.assignedAt ?? 0)
      ),
    [assignedGroups, assignedReports]
  );

  const confirmReject = async () => {
    if (reason.trim().length < 20) {
      showWarningAlert('El motivo debe tener al menos 20 caracteres.');
      return;
    }

    setIsRejecting(true);
    try {
      await rejectAssignment(
        pendingAssignment.sourceType,
        pendingAssignment.id,
        reason
      );
      showSuccessAlert('Asignación rechazada. El gestor ha sido notificado.');
      setPendingAssignment(null);
      setReason('');
    } catch (error) {
      showErrorAlert(error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<ClipboardList />}
        title="Mis asignaciones"
        description="Atiende reportes individuales y grupos asignados."
        size="compact"
      />

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Cargando asignaciones...
        </div>
      ) : assignments.length ? (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <OperatorAssignmentCard
              key={`${assignment.sourceType}-${assignment.id}`}
              assignment={assignment}
              onReject={(selected) => {
                setPendingAssignment(selected);
                setReason('');
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No tienes asignaciones activas." />
      )}

      <RejectAssignmentDialog
        assignment={pendingAssignment}
        reason={reason}
        isLoading={isRejecting}
        onReasonChange={setReason}
        onConfirm={confirmReject}
        onClose={() => {
          setPendingAssignment(null);
          setReason('');
        }}
      />
    </div>
  );
}
