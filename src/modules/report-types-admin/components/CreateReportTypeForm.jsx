import { Tags } from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ReportTypeForm } from '@/modules/report-types-admin/components/ReportTypeForm';
import { ReportTypePreviewDialog } from '@/modules/report-types-admin/components/ReportTypePreviewDialog';
import { useReportTypeManagement } from '@/modules/report-types-admin/context/ReportTypeManagementContext';
import { useCreateReportTypeForm } from '@/modules/report-types-admin/hooks/useCreateReportTypeForm';

export function CreateReportTypeForm() {
  const [showPreview, setShowPreview] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const { isMutating } = useReportTypeManagement();
  const form = useCreateReportTypeForm();
  const confirmation = CONFIRMATION_MESSAGES.reportTypes.create(form.formData.label);

  const requestCreate = (event) => {
    event.preventDefault();
    if (form.validateForm()) setShowPreview(true);
  };

  const continueToConfirmation = () => {
    setShowPreview(false);
    setConfirmCreate(true);
  };

  const confirmCreation = async () => {
    const createdType = await form.submitForm();
    if (createdType) setConfirmCreate(false);
  };

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
          onSubmit={requestCreate}
          onReset={form.resetForm}
          submitLabel="Guardar tipo"
        />
      </CardContent>

      {showPreview && (
        <ReportTypePreviewDialog
          open
          formData={form.formData}
          onBack={() => setShowPreview(false)}
          onContinue={continueToConfirmation}
        />
      )}

      <ConfirmationMessage
        open={confirmCreate}
        {...confirmation}
        isLoading={isMutating}
        onAccept={confirmCreation}
        onReject={() => setConfirmCreate(false)}
      />
    </Card>
  );
}
