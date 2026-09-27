const API_URL = 'http://localhost:3000';

export async function getRoles() {
  const response = await fetch(`${API_URL}/api/roles`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener los roles');
  }

  return response.json();
}