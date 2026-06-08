import { Tags } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ReportTypeForm } from '@/modules/admin/report-types/components/ReportTypeForm';
import { useCreateReportTypeForm } from '@/modules/admin/report-types/hooks/useCreateReportTypeForm';

export function CreateReportTypeForm() {
  const form = useCreateReportTypeForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="size-5 text-primary" />
          Crear tipo de reporte
        </CardTitle>
        <CardDescription>
          Define una categoría, su color y las razones asociadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReportTypeForm
          mode="create"
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
          submitLabel="Guardar tipo"
        />
      </CardContent>
    </Card>
  );
}
