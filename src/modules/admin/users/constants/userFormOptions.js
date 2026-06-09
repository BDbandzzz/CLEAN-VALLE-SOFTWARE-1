import { USER_ROLE_IDS } from '@/core/constants/domainConstants';

export const USER_ROLE_OPTIONS = [
  { id: USER_ROLE_IDS.TEACHER, label: 'Docente' },
  { id: USER_ROLE_IDS.STUDENT, label: 'Estudiante' },
  { id: USER_ROLE_IDS.MANAGER, label: 'Gestor' },
  { id: USER_ROLE_IDS.OPERATOR, label: 'Operador' },
  { id: USER_ROLE_IDS.ADMIN, label: 'Administrador' },
];

export const ADMIN_CREATABLE_ROLES = USER_ROLE_OPTIONS.filter(
  (role) => role.id !== USER_ROLE_IDS.ADMIN
);

export const INITIAL_USER_FORM = {
  codeUser: '',
  firstName: '',
  lastName: '',
  email: '',
  dniUser: '',
  typeDniId: '',
  genderId: '',
  roleId: '',
  specializationIds: [],
  password: '',
  confirmPassword: '',
};
