export function mapUserToForm(user) {
  return {
    codeUser: user?.codeUser ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    dniUser: user?.dniUser ?? '',
    typeDniId: user?.typeDniId ? String(user.typeDniId) : '',
    genderId: user?.genderId ? String(user.genderId) : '',
    roleId: user?.roleId ? String(user.roleId) : '',
    specializationIds: user?.specializationIds ?? [],
    password: '',
    confirmPassword: '',
  };
}
