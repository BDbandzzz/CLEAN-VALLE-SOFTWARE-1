import { useMemo } from 'react';

import { useReportTypeManagement } from '@/modules/admin/report-types/context/ReportTypeManagementContext';
import { mapReportTypeToForm } from '@/modules/admin/report-types/data/reportTypeRepository';
import { useReportTypeForm } from '@/modules/admin/report-types/hooks/useReportTypeForm';
import { validateReportTypeForm } from '@/modules/admin/report-types/utils/reportTypeValidation';

export function useEditReportTypeForm(reportType) {
  const { reportTypes, updateReportType } = useReportTypeManagement();
  const initialData = useMemo(() => mapReportTypeToForm(reportType), [reportType]);
  const form = useReportTypeForm(initialData);

  const submitForm = (event) => {
    event.preventDefault();
    if (!reportType) return null;

    const validationErrors = validateReportTypeForm(form.formData, reportTypes, {
      currentTypeId: reportType.id,
    });

    if (Object.keys(validationErrors).some((key) => key !== 'subtypeErrors' || Object.keys(validationErrors.subtypeErrors ?? {}).length)) {
      form.setErrors(validationErrors);
      form.setMessage('');
      return null;
    }

    const updatedType = updateReportType(reportType.id, form.formData);
    form.setErrors({});
    form.setMessage(`${updatedType.label} fue actualizado correctamente.`);
    return updatedType;
  };

  return { ...form, submitForm };
}
