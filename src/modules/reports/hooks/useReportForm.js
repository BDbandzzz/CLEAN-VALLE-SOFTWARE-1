/**
 * useReportForm
 * -------------
 * Gestiona todo el estado y la validación del formulario de creación de reporte.
 *
 * Responsabilidades:
 *   - Estado de los campos (form)
 *   - Estado de errores por campo (errors)
 *   - Estado de campos tocados para mostrar errores on-demand (touched)
 *   - Lógica de validación centralizada (validateReport)
 *   - Helpers: set(), reset(), handleSubmit()
 *
 * NO es responsable de:
 *   - Renderizar ningún elemento de UI
 *   - Manejar imágenes (ver useImageUpload)
 *   - Enviar datos al backend (el caller decide qué hacer con onSubmit)
 */
import { useState } from 'react';

/* ── Valores iniciales ────────────────────────────────────────────────────── */

const INITIAL_FORM = {
  title: '',
  description: '',
  location: '',
  riskLevel: '',
  reportType: '',
  incidentDate: '',
};

const INITIAL_ERRORS = {
  title: '',
  description: '',
  location: '',
  riskLevel: '',
  reportType: '',
  incidentDate: '',
};

/* ── Función de validación ───────────────────────────────────────────────── */

/**
 * Valida todos los campos del reporte.
 * @param {typeof INITIAL_FORM} data
 * @returns {{ ok: boolean, errors: typeof INITIAL_ERRORS }}
 */
function validateReport(data) {
  const errors = { ...INITIAL_ERRORS };
  let ok = true;

  if (!data.title.trim()) {
    errors.title = 'El título es requerido.'; ok = false;
  } else if (data.title.trim().length < 5) {
    errors.title = 'Mínimo 5 caracteres.'; ok = false;
  }

  if (!data.description.trim()) {
    errors.description = 'La descripción es requerida.'; ok = false;
  } else if (data.description.trim().length < 10) {
    errors.description = 'Mínimo 10 caracteres.'; ok = false;
  }

  if (!data.location.trim()) {
    errors.location = 'La localización es requerida.'; ok = false;
  }

  if (!data.riskLevel) {
    errors.riskLevel = 'Selecciona un nivel de riesgo.'; ok = false;
  }

  if (!data.reportType) {
    errors.reportType = 'Selecciona un tipo de reporte.'; ok = false;
  }

  if (!data.incidentDate) {
    errors.incidentDate = 'La fecha del incidente es requerida.'; ok = false;
  }

  return { ok, errors };
}

/* ── Hook ────────────────────────────────────────────────────────────────── */

export function useReportForm() {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});

  /**
   * Actualiza un campo del formulario y limpia su error.
   * @param {string} field - Nombre del campo
   * @param {string} value - Nuevo valor
   */
  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /** Restaura el formulario a su estado inicial. */
  const reset = () => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTouched({});
  };

  /**
   * Valida el formulario y llama a onSubmit si es válido.
   * @param {React.FormEvent} e
   * @param {File[]} images - Archivos de imagen adjuntos
   * @param {Function} onSubmit - Handler externo de envío
   */
  const handleSubmit = (e, images, onSubmit) => {
    e.preventDefault();
    // Marca todos los campos como tocados para mostrar todos los errores
    setTouched(Object.fromEntries(Object.keys(INITIAL_FORM).map((k) => [k, true])));
    const { ok, errors: newErrors } = validateReport(form);
    setErrors(newErrors);
    if (!ok) return;
    onSubmit({ ...form, images });
  };

  return { form, errors, touched, set, reset, handleSubmit };
}
