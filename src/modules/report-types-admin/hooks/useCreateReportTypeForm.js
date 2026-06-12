import { INITIAL_REPORT_TYPE_FORM } from '@/modules/report-types-admin/constants/reportTypeFormOptions';
import { useReportTypeManagement } from '@/modules/report-types-admin/context/ReportTypeManagementContext';
import { useReportTypeForm } from '@/modules/report-types-admin/hooks/useReportTypeForm';
import { validateReportTypeForm } from '@/modules/report-types-admin/utils/reportTypeValidation';
import {
  showErrorAlert,
  showSuccessAlert,
  showValidationAlert,
} from '@/core/services/alertService';

export function useCreateReportTypeForm() {
  const { reportTypes, createReportType } = useReportTypeManagement();
  const form = useReportTypeForm(INITIAL_REPORT_TYPE_FORM);

  const validateForm = () => {
    const validationErrors = validateReportTypeForm(form.formData, reportTypes);

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
      const createdType = await createReportType(form.formData);
      form.setFormData(INITIAL_REPORT_TYPE_FORM);
      form.setErrors({});
      form.setMessage(`${createdType.label} fue creado correctamente.`);
      showSuccessAlert('El tipo de reporte fue creado correctamente.');
      return createdType;
    } catch (error) {
      form.setErrors({ form: error.message });
      form.setMessage('');
      showErrorAlert(error);
      return null;
    }
  };

  return { ...form, validateForm, submitForm };
}
