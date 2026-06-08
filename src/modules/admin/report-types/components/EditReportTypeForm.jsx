import { Pencil } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ReportTypeForm } from '@/modules/admin/report-types/components/ReportTypeForm';
import { useEditReportTypeForm } from '@/modules/admin/report-types/hooks/useEditReportTypeForm';

export function EditReportTypeForm({ reportType }) {
  const form = useEditReportTypeForm(reportType);

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
          onSubtypeToggle={form.toggleSubtype}
          onSubmit={form.submitForm}
          onReset={form.resetForm}
          submitLabel="Guardar cambios"
        />
      </CardContent>
    </Card>
  );
}
