import { useState } from 'react';

import { INITIAL_USER_FORM } from '@/modules/admin/users/constants/userFormOptions';

export function useUserForm(initialData = INITIAL_USER_FORM) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === 'role' && value !== 'operador' ? { specializationIds: [] } : {}),
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
