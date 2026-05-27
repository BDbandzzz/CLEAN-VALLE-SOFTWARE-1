function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function getCatalogLabel(catalogs, catalogKey, value, fallback = '') {
  const option = catalogs?.[catalogKey]?.find((item) => String(item.id) === String(value));
  return option?.label ?? fallback;
}

export function getTypeDniLabel(user, catalogs) {
  const value = pickFirst(user?.typeDniId, user?.typeDni);
  return getCatalogLabel(catalogs, 'documentTypes', value);
}

export function getGenderLabel(user, catalogs) {
  const value = pickFirst(user?.genderId, user?.gender);
  return getCatalogLabel(catalogs, 'genders', value);
}

export function mapUserToProfileForm(user, catalogs) {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    dniUser: user?.dniUser || '',
    typeDni: getTypeDniLabel(user, catalogs),
    gender: getGenderLabel(user, catalogs),
  };
}
