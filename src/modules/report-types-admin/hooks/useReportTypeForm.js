import { useState } from 'react';

import { INITIAL_REPORT_TYPE_FORM } from '@/modules/report-types-admin/constants/reportTypeFormOptions';

function createEmptySubtype() {
  return {
    id: `subtype-${Date.now()}`,
    label: '',
    description: '',
  };
}

export function useReportTypeForm(initialData = INITIAL_REPORT_TYPE_FORM) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setMessage('');
  };

  const addSubtype = () => {
    setFormData((current) => ({
      ...current,
      subtypes: [...current.subtypes, createEmptySubtype()],
    }));
    setMessage('');
  };

  const updateSubtype = (subtypeId, field, value) => {
    setFormData((current) => ({
      ...current,
      subtypes: current.subtypes.map((subtype) =>
        subtype.id === subtypeId ? { ...subtype, [field]: value } : subtype
      ),
    }));
    setErrors((current) => ({
      ...current,
      subtypes: '',
      subtypeErrors: { ...(current.subtypeErrors ?? {}), [subtypeId]: '' },
    }));
    setMessage('');
  };

  const removeSubtype = (subtypeId) => {
    setFormData((current) => ({
      ...current,
      subtypes: current.subtypes.filter((subtype) => subtype.id !== subtypeId),
    }));
    setMessage('');
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setMessage('');
  };

  return {
    formData,
    errors,
    message,
    setFormData,
    setErrors,
    setMessage,
    updateField,
    addSubtype,
    updateSubtype,
    removeSubtype,
    resetForm,
  };
}
