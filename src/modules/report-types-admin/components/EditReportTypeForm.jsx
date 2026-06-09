import { Pencil } from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ReportTypeForm } from '@/modules/report-types-admin/components/ReportTypeForm';
import { useReportTypeManagement } from '@/modules/report-types-admin/context/ReportTypeManagementContext';
import { useEditReportTypeForm } from '@/modules/report-types-admin/hooks/useEditReportTypeForm';

export function EditReportTypeForm({ reportType }) {
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const { isMutating } = useReportTypeManagement();
  const form = useEditReportTypeForm(reportType);
  const confirmation = CONFIRMATION_MESSAGES.reportTypes.update(form.formData.label);

  const requestUpdate = (event) => {
    event.preventDefault();
    if (form.validateForm()) setConfirmUpdate(true);
  };

  const confirmUpdateType = async () => {
    const updatedType = await form.submitForm();
    if (updatedType) setConfirmUpdate(false);
  };

  if (!reportType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil className="size-5 text-primary" />
            Modificar tipo de reporte
          </CardTitle>
          <CardDescription>
            Selecciona un tipo desde Tipos totales para editarlo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Ningún tipo seleccionado"
            description="Ve a Tipos totales y usa la acción Modificar."
            icon={<Pencil className="mx-auto size-8 text-muted-foreground" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pencil className="size-5 text-primary" />
          Modificar tipo de reporte
        </CardTitle>
        <CardDescription>
          Edita título, descripción, color y razones de {reportType.label}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReportTypeForm
          key={reportType.id}
          mode="edit"
          formData={form.formData}
          errors={form.errors}
          message={form.message}
          onFieldChange={form.updateField}
          onSubtypeAdd={form.addSubtype}
          onSubtypeChange={form.updateSubtype}
          onSubtypeRemove={form.removeSubtype}
          onSubmit={requestUpdate}
          onReset={form.resetForm}
          submitLabel="Guardar cambios"
        />
      </CardContent>

      <ConfirmationMessage
        open={confirmUpdate}
        {...confirmation}
        isLoading={isMutating}
        onAccept={confirmUpdateType}
        onReject={() => setConfirmUpdate(false)}
      />
    </Card>
  );
}
