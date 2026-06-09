export function getTypeDniLabel(user) {
  return user?.typeDni ?? '';
}

export function getGenderLabel(user) {
  return user?.gender ?? '';
}

export function mapUserToProfileForm(user) {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    dniUser: user?.dniUser || '',
    typeDni: getTypeDniLabel(user),
    gender: getGenderLabel(user),
    state: user?.stateName || '',
  };
}
