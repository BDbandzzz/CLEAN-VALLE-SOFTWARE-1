import { DEMO_USERS } from '@/core/data/cleanvalleSchema';

const USERS_STORAGE_KEY = 'cleanvalle_admin_users_v1';

function publicDemoUser(user) {
  const { password: _password, ...publicUser } = user;
  return {
    ...publicUser,
    active: user.active !== false,
    source: 'demo',
  };
}

export function readManagedUsers() {
  try {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) ?? [];
    const usersById = new Map(
      DEMO_USERS.map((user) => [String(user.id), publicDemoUser(user)])
    );

    storedUsers.forEach((user) => {
      usersById.set(String(user.id), user);
    });

    return Array.from(usersById.values());
  } catch {
    return DEMO_USERS.map(publicDemoUser);
  }
}

export function persistManagedUsers(users) {
  const localUsers = users.filter((user) => user.source !== 'demo');
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(localUsers));
}

export function buildManagedUser(formData) {
  const now = new Date().toISOString();

  return {
    id: `usr-${Date.now()}`,
    codeUser: formData.codeUser.trim(),
    role: formData.role,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    dniUser: formData.dniUser.trim(),
    typeDniId: Number(formData.typeDniId),
    genderId: Number(formData.genderId),
    specializationIds: formData.role === 'operador' ? formData.specializationIds : [],
    active: true,
    source: 'admin',
    createdAt: now,
    updatedAt: now,
  };
}
