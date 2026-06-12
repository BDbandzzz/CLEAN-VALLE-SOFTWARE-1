import { useMemo } from 'react';

import { useReportTypeManagement } from '@/modules/report-types-admin/context/ReportTypeManagementContext';
import { mapReportTypeToForm } from '@/modules/report-types-admin/data/reportTypeRepository';
import { useReportTypeForm } from '@/modules/report-types-admin/hooks/useReportTypeForm';
import { validateReportTypeForm } from '@/modules/report-types-admin/utils/reportTypeValidation';
import {
  showErrorAlert,
  showSuccessAlert,
  showValidationAlert,
} from '@/core/services/alertService';

export function useEditReportTypeForm(reportType) {
  const { reportTypes, updateReportType } = useReportTypeManagement();
  const initialData = useMemo(() => mapReportTypeToForm(reportType), [reportType]);
  const form = useReportTypeForm(initialData);

  const validateForm = () => {
    if (!reportType) return false;

    const validationErrors = validateReportTypeForm(form.formData, reportTypes, {
      currentTypeId: reportType.id,
    });

    if (Object.keys(validationErrors).some((key) => key !== 'subtypeErrors' || Object.keys(validationErrors.subtypeErrors ?? {}).length)) {
      form.setErrors(validationErrors);
      form.setMessage('');
      showValidationAlert(validationErrors);
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) return null;
    try {
      const updatedType = await updateReportType(reportType.id, form.formData);
      form.setErrors({});
      form.setMessage(`${updatedType.label} fue actualizado correctamente.`);
      showSuccessAlert('El tipo de reporte fue actualizado correctamente.');
      return updatedType;
    } catch (error) {
      form.setErrors({ form: error.message });
      form.setMessage('');
      showErrorAlert(error);
      return null;
    }
  };

  return { ...form, validateForm, submitForm };
}
