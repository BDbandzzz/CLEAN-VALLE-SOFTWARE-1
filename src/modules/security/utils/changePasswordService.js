import { apiRequest } from '@/core/services/apiClient';

export async function changePasswordAfterLogin(codeUser, passwordData) {
  await apiRequest(`/api/users/${codeUser}/password`, {
    method: 'PUT',
    body: {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    },
  });
}
