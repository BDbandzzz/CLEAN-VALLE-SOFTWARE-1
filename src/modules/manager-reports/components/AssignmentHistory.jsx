import { History } from 'lucide-react';

import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';

export function AssignmentHistory({ assignments = [] }) {
  return (
    <section className="space-y-4 rounded-lg bg-card px-5 py-6 shadow-sm sm:px-7">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <History className="size-5" />
        Historial de asignaciones
      </h2>

      {assignments.length ? (
        <div className="overflow-x-auto rounded-lg bg-background">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Operador</th>
                <th className="px-4 py-3">Gestor</th>
                <th className="px-4 py-3">Asignado</th>
                <th className="px-4 py-3">Cerrado</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignments.map((assignment) => (
                <tr key={`${assignment.operatorUuid}-${assignment.assignedAt}`}>
                  <td className="px-4 py-3 font-medium">{assignment.operatorName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{assignment.managerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(assignment.assignedAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(assignment.closedAt)}</td>
                  <td className="px-4 py-3">{getStateLabel(assignment.stateId)}</td>
                  <td className="max-w-72 px-4 py-3 text-muted-foreground">{assignment.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">El reporte aun no tiene asignaciones.</p>
      )}
    </section>
  );
}

function getStateLabel(stateId) {
  if (Number(stateId) === ELEMENT_STATE_IDS.ACTIVE) return 'Activa';
  if (Number(stateId) === ELEMENT_STATE_IDS.INACTIVE) return 'Inactiva';
  if (Number(stateId) === ELEMENT_STATE_IDS.CLOSED) return 'Cerrada';
  return 'Sin estado';
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
