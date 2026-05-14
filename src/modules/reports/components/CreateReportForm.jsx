import { useState } from 'react';
import { Send, RotateCcw, MapPin, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { REPORT_TYPES, RISK_LEVELS } from '../constants/reportConstants';
import { TypeButton } from './TypeButton';

const INITIAL_FORM = {
  title: '',
  description: '',
  location: '',
  riskLevel: '',
  reportType: '',
  incidentDate: '',
};

const FIELD_ERRORS_INITIAL = {
  title: '',
  description: '',
  location: '',
  riskLevel: '',
  reportType: '',
  incidentDate: '',
};

function validateReport(data) {
  const errors = { ...FIELD_ERRORS_INITIAL };
  let ok = true;

  if (!data.title.trim()) { errors.title = 'El título es requerido.'; ok = false; }
  else if (data.title.trim().length < 5) { errors.title = 'Mínimo 5 caracteres.'; ok = false; }

  if (!data.description.trim()) { errors.description = 'La descripción es requerida.'; ok = false; }
  else if (data.description.trim().length < 10) { errors.description = 'Mínimo 10 caracteres.'; ok = false; }

  if (!data.location.trim()) { errors.location = 'La localización es requerida.'; ok = false; }

  if (!data.riskLevel) { errors.riskLevel = 'Selecciona un nivel de riesgo.'; ok = false; }

  if (!data.reportType) { errors.reportType = 'Selecciona un tipo de reporte.'; ok = false; }

  if (!data.incidentDate) { errors.incidentDate = 'La fecha del incidente es requerida.'; ok = false; }

  return { ok, errors };
}

/**
 * Formulario de creación de reporte.
 * Recibe onSubmit(formData) para manejo externo.
 */
export function CreateReportForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(FIELD_ERRORS_INITIAL);
  const [touched, setTouched] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors(FIELD_ERRORS_INITIAL);
    setTouched({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(INITIAL_FORM).map((k) => [k, true])));
    const { ok, errors: newErrors } = validateReport(form);
    setErrors(newErrors);
    if (!ok) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" id="create-report-form">
      {/* Título */}
      <FormField
        id="report-title"
        label="Título del reporte"
        required
        icon={<FileText className="size-4" />}
        error={touched.title ? errors.title : ''}
      >
        <input
          id="report-title"
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Ej. Basura acumulada en la zona norte"
          maxLength={120}
          className={inputClass(touched.title && errors.title)}
        />
      </FormField>

      {/* Descripción */}
      <FormField
        id="report-description"
        label="Descripción del reporte"
        required
        icon={<FileText className="size-4" />}
        error={touched.description ? errors.description : ''}
      >
        <textarea
          id="report-description"
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe el problema con el mayor detalle posible…"
          maxLength={800}
          className={`${inputClass(touched.description && errors.description)} resize-none`}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">{form.description.length}/800</p>
      </FormField>

      {/* Localización */}
      <FormField
        id="report-location"
        label="Localización"
        required
        icon={<MapPin className="size-4" />}
        error={touched.location ? errors.location : ''}
      >
        <input
          id="report-location"
          type="text"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="Ej. Bloque A – Piso 2, Cafetería Central"
          maxLength={200}
          className={inputClass(touched.location && errors.location)}
        />
      </FormField>

      {/* Fecha del incidente */}
      <FormField
        id="report-incident-date"
        label="Fecha del incidente"
        required
        icon={<Calendar className="size-4" />}
        error={touched.incidentDate ? errors.incidentDate : ''}
      >
        <input
          id="report-incident-date"
          type="date"
          value={form.incidentDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => set('incidentDate', e.target.value)}
          className={inputClass(touched.incidentDate && errors.incidentDate)}
        />
      </FormField>

      {/* Nivel de riesgo */}
      <FormField
        id="report-risk-level"
        label="Nivel de riesgo"
        required
        icon={<AlertTriangle className="size-4" />}
        error={touched.riskLevel ? errors.riskLevel : ''}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          {RISK_LEVELS.map((r) => (
            <TypeButton
              key={r.id}
              id={`risk-${r.id}`}
              label={r.label}
              color={r.color}
              isSelected={form.riskLevel === r.id}
              onClick={() => set('riskLevel', r.id)}
            />
          ))}
        </div>
      </FormField>

      {/* Tipo de reporte */}
      <FormField
        id="report-type"
        label="Tipo de reporte"
        required
        icon={<FileText className="size-4" />}
        error={touched.reportType ? errors.reportType : ''}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          {REPORT_TYPES.map((t) => (
            <TypeButton
              key={t.id}
              id={`type-${t.id}`}
              label={t.label}
              color={t.color}
              isSelected={form.reportType === t.id}
              onClick={() => set('reportType', t.id)}
            />
          ))}
        </div>
      </FormField>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          id="submit-report-btn"
          disabled={isSubmitting}
          className="
            inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm
            font-semibold text-primary-foreground shadow-sm transition
            hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        >
          <Send className="size-4" />
          {isSubmitting ? 'Enviando…' : 'Enviar reporte'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          className="
            inline-flex items-center gap-2 rounded-lg border border-border bg-background
            px-5 py-2.5 text-sm font-medium text-muted-foreground transition
            hover:bg-muted hover:text-foreground disabled:opacity-50
          "
        >
          <RotateCcw className="size-4" />
          Limpiar
        </button>
      </div>
    </form>
  );
}

/* ── helpers ── */

function inputClass(hasError) {
  return [
    'w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm transition',
    'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
    hasError ? 'border-destructive focus:ring-destructive/40' : 'border-input',
  ].join(' ');
}

function FormField({ id, label, required, icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
