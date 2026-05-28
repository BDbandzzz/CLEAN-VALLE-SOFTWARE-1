import { useState } from 'react';

import { getSubTypeOptions } from '../constants/reportConstants';

const INITIAL_FORM = {
  title: '',
  description: '',
  categoryId: '',
  subtypeId: '',
  customContext: '',
  locationId: '',
  riskLevelId: '',
  incidentDate: '',
};

const INITIAL_ERRORS = {
  title: '',
  description: '',
  categoryId: '',
  subtypeId: '',
  customContext: '',
  locationId: '',
  riskLevelId: '',
  incidentDate: '',
};

function validateReport(data) {
  const errors = { ...INITIAL_ERRORS };
  let ok = true;
  const subtypeOptions = getSubTypeOptions(data.categoryId);
  const needsSubtype = Boolean(data.categoryId && data.categoryId !== 'otro' && subtypeOptions.length);
  const needsContext = Boolean(
    data.categoryId === 'otro' ||
    data.subtypeId === 'otro' ||
    (data.categoryId && !subtypeOptions.length)
  );

  if (!data.title.trim()) {
    errors.title = 'El titulo es requerido.';
    ok = false;
  } else if (data.title.trim().length < 5) {
    errors.title = 'Minimo 5 caracteres.';
    ok = false;
  }

  if (!data.description.trim()) {
    errors.description = 'La descripcion es requerida.';
    ok = false;
  } else if (data.description.trim().length < 10) {
    errors.description = 'Minimo 10 caracteres.';
    ok = false;
  }

  if (!data.categoryId) {
    errors.categoryId = 'Selecciona el tipo de reporte.';
    ok = false;
  }

  if (needsSubtype && !data.subtypeId) {
    errors.subtypeId = 'Selecciona la razon del reporte.';
    ok = false;
  }

  if (needsContext && !data.customContext.trim()) {
    errors.customContext = 'Agrega el contexto del reporte.';
    ok = false;
  }

  if (!data.locationId) {
    errors.locationId = 'Selecciona la ubicacion.';
    ok = false;
  }

  if (!data.riskLevelId) {
    errors.riskLevelId = 'Selecciona un nivel de riesgo.';
    ok = false;
  }

  if (!data.incidentDate) {
    errors.incidentDate = 'La fecha del incidente es requerida.';
    ok = false;
  }

  return { ok, errors };
}

export function useReportForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});

  const set = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'categoryId') {
        next.subtypeId = '';
        next.customContext = '';
      }
      if (field === 'subtypeId' && value !== 'otro' && next.categoryId !== 'otro') {
        next.customContext = '';
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTouched({});
  };

  const handleSubmit = (e, images, onSubmit) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(INITIAL_FORM).map((key) => [key, true])));
    const validation = validateReport(form);
    setErrors(validation.errors);
    if (!validation.ok) return;
    onSubmit({ ...form, images });
  };

  return { form, errors, touched, set, reset, handleSubmit };
}
