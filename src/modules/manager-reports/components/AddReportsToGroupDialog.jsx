import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FormField } from '@/core/components/forms/FormField';
import { formControlClass } from '@/core/components/forms/formStyles';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';

export function AddReportsToGroupDialog({
  open,
  reports,
  selectedIds,
  isLoading,
  onToggle,
  onConfirm,
  onClose,
}) {
  const [search, setSearch] = useState('');
  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return reports;

    return reports.filter((report) =>
      [report.title, report.subtypeName, report.localizationName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [reports, search]);

  return (
    <ConfirmationMessage
      open={open}
      {...CONFIRMATION_MESSAGES.reports.addToGroup(selectedIds.length)}
      isLoading={isLoading}
      acceptDisabled={!selectedIds.length}
      onAccept={onConfirm}
      onReject={() => {
        setSearch('');
        onClose();
      }}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <FormField
          id="group-report-search"
          label="Buscar reportes"
          icon={<Search className="size-4" />}
        >
          <input
            id="group-report-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Título, razón o lugar"
            className={formControlClass()}
          />
        </FormField>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {filteredReports.length ? (
            filteredReports.map((report) => (
              <label
                key={report.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-primary/40"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(report.id)}
                  onChange={() => onToggle(report.id)}
                  className="mt-1 size-4 rounded border-input accent-primary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {report.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <ReportBadge
                      type="risk"
                      label={report.riskLevelName}
                      color={report.riskLevelColor}
                    />
                    <span className="text-xs text-muted-foreground">
                      {report.subtypeName}
                    </span>
                  </span>
                </span>
              </label>
            ))
          ) : (
            <p className="rounded-lg bg-muted/40 p-5 text-center text-sm text-muted-foreground">
              No hay reportes disponibles para añadir.
            </p>
          )}
        </div>
      </div>
    </ConfirmationMessage>
  );
}
