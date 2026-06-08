import { INITIAL_REPORT_TYPE_FORM } from '@/modules/admin/report-types/constants/reportTypeFormOptions';
import { useReportTypeManagement } from '@/modules/admin/report-types/context/ReportTypeManagementContext';
import { useReportTypeForm } from '@/modules/admin/report-types/hooks/useReportTypeForm';
import { validateReportTypeForm } from '@/modules/admin/report-types/utils/reportTypeValidation';

export function useCreateReportTypeForm() {
  const { reportTypes, createReportType } = useReportTypeManagement();
  const form = useReportTypeForm(INITIAL_REPORT_TYPE_FORM);

  const submitForm = (event) => {
    event.preventDefault();
    const validationErrors = validateReportTypeForm(form.formData, reportTypes);

    if (Object.keys(validationErrors).some((key) => key !== 'subtypeErrors' || Object.keys(validationErrors.subtypeErrors ?? {}).length)) {
      form.setErrors(validationErrors);
      form.setMessage('');
      return null;
    }

    const createdType = createReportType(form.formData);
    form.setFormData(INITIAL_REPORT_TYPE_FORM);
    form.setErrors({});
    form.setMessage(`${createdType.label} fue creado correctamente.`);
    return createdType;
  };

  return { ...form, submitForm };
}
