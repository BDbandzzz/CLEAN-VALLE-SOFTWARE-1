export const EMPTY_CATALOGS = {
  genders: [],
  roles: [],
  typeDni: [],
  typeReport: [],
  statusReport: [],
  riskLevel: [],
};

const CATALOG_SCHEMAS = {
  genders: {
    idField: 'idGender',
    labelField: 'gender',
  },
  roles: {
    idField: 'idRole',
    labelField: 'roleName',
    descriptionField: 'description',
  },
  typeDni: {
    idField: 'idTypeDni',
    labelField: 'dniType',
  },
  typeReport: {
    idField: 'idType',
    labelField: 'typeReport',
    descriptionField: 'description',
  },
  statusReport: {
    idField: 'idStatus',
    labelField: 'statusReport',
    descriptionField: 'description',
  },
  riskLevel: {
    idField: 'idRisk',
    labelField: 'riskLevel',
    descriptionField: 'description',
  },
};

export function normalizeCatalogText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function assertCatalogSchema(catalogKey) {
  const schema = CATALOG_SCHEMAS[catalogKey];
  if (!schema) {
    throw new Error(`Catalogo no soportado: ${catalogKey}`);
  }
  return schema;
}

function assertValidCatalogItem(item, catalogKey, schema) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`Respuesta invalida para ${catalogKey}: se esperaba un objeto`);
  }

  if (!(schema.idField in item)) {
    throw new Error(`Respuesta invalida para ${catalogKey}: falta ${schema.idField}`);
  }

  if (!(schema.labelField in item)) {
    throw new Error(`Respuesta invalida para ${catalogKey}: falta ${schema.labelField}`);
  }
}

export function normalizeCatalogItem(item, catalogKey) {
  const schema = assertCatalogSchema(catalogKey);
  assertValidCatalogItem(item, catalogKey, schema);

  const id = item[schema.idField];
  const label = item[schema.labelField];

  return {
    id: String(id),
    value: id,
    label: String(label ?? ''),
    description: schema.descriptionField ? item[schema.descriptionField] ?? '' : '',
    raw: item,
  };
}

export function normalizeCatalogList(list, catalogKey) {
  if (!Array.isArray(list)) {
    throw new Error(`Respuesta invalida para ${catalogKey}: se esperaba un arreglo`);
  }

  return list.map((item) => normalizeCatalogItem(item, catalogKey));
}

export function normalizeCatalogCollection(collection = {}) {
  return Object.keys(EMPTY_CATALOGS).reduce((acc, key) => {
    acc[key] = normalizeCatalogList(collection[key] ?? [], key);
    return acc;
  }, { ...EMPTY_CATALOGS });
}

export function findCatalogOption(options = [], value) {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'object') {
    return null;
  }

  const textValue = normalizeCatalogText(value);
  return (
    options.find((option) => String(option.value) === String(value) || option.id === String(value)) ||
    options.find((option) => normalizeCatalogText(option.label) === textValue) ||
    null
  );
}

export function resolveCatalogLabel(options = [], value, fallback = '') {
  const option = findCatalogOption(options, value);
  return option?.label ?? String(fallback || value || '');
}

export function getCatalogPayloadId(options = [], value) {
  const option = findCatalogOption(options, value);
  return option?.value ?? null;
}

export function hasCatalogOptions(catalogs, catalogKey) {
  return Array.isArray(catalogs?.[catalogKey]) && catalogs[catalogKey].length > 0;
}
