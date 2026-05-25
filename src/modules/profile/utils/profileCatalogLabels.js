import { resolveCatalogLabel } from '@/core/catalogs/catalogUtils';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function getCatalogLabel(catalogs, catalogKey, value, fallback = '') {
  return resolveCatalogLabel(catalogs?.[catalogKey] ?? [], value, fallback);
}

export function getTypeDniLabel(user, catalogs) {
  const value = pickFirst(user?.typeDniId, user?.typeDni);
  return getCatalogLabel(catalogs, 'typeDni', value);
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
