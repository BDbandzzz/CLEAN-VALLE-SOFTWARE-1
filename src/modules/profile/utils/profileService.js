import { apiRequest } from '@/core/services/apiClient';

export function updateUserEmail(codeUser, email) {
  return apiRequest(`/api/users/${codeUser}/update-user`, {
    method: 'PUT',
    body: { email },
  });
}
