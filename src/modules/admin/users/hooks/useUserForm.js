import { useState } from 'react';

import { isOperatorRoleId } from '@/core/mappers/domainMappers';
import { INITIAL_USER_FORM } from '@/modules/admin/users/constants/userFormOptions';

export function useUserForm(initialData = INITIAL_USER_FORM) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === 'roleId' && !isOperatorRoleId(value) ? { specializationIds: [] } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: '' }));
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
    resetForm,
  };
}
