import { useState } from 'react';

import { INITIAL_USER_FORM } from '@/modules/admin/users/constants/userFormOptions';
import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';
import { validateUserForm } from '@/modules/admin/users/utils/userFormValidation';

export function useCreateUserForm() {
  const { users, createUser } = useUserManagement();
  const [formData, setFormData] = useState(INITIAL_USER_FORM);
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
    setFormData(INITIAL_USER_FORM);
    setErrors({});
    setMessage('');
  };

  const submitForm = (event) => {
    event.preventDefault();
    const validationErrors = validateUserForm(formData, users);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage('');
      return null;
    }

    const createdUser = createUser(formData);
    setFormData(INITIAL_USER_FORM);
    setErrors({});
    setMessage(`${createdUser.firstName} ${createdUser.lastName} fue registrado correctamente.`);
    return createdUser;
  };

  return {
    formData,
    errors,
    message,
    updateField,
    resetForm,
    submitForm,
  };
}
