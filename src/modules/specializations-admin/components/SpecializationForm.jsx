import { Save } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { SelectField } from '@/core/components/ui/select-field';
import {
  createManagedSpecialization,
  updateManagedSpecialization,
} from '@/services/adminSpecializationService';

const EMPTY_FORM = { categoryId: '', label: '' };

export function SpecializationForm({
  specialization,
  categories,
  isSaving,
  setIsSaving,
  onSaved,
}) {
  const [formData, setFormData] = useState(() =>
    specialization
      ? {
          categoryId: String(specialization.categoryId),
          label: specialization.label,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const isEditing = Boolean(specialization);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!formData.categoryId) nextErrors.categoryId = 'Selecciona una categoría.';
    if (!formData.label.trim()) nextErrors.label = 'El nombre es obligatorio.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        await updateManagedSpecialization(specialization.id, formData);
        setMessage('La especialización fue actualizada.');
      } else {
        await createManagedSpecialization(formData);
        setFormData(EMPTY_FORM);
        setMessage('La especialización fue creada.');
      }
      setErrors({});
      await onSaved?.();
    } catch (error) {
      setErrors({ form: error.message });
      setMessage('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Modificar especialización' : 'Crear especialización'}
        </CardTitle>
        <CardDescription>
          Vincula una capacidad operativa con una categoría de reporte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <SelectField
            id="specialization-category"
            label="Categoría"
            value={formData.categoryId}
            options={categories}
            onChange={(event) => {
              setFormData((current) => ({
                ...current,
                categoryId: event.target.value,
              }));
              setErrors((current) => ({ ...current, categoryId: '' }));
            }}
            required
            error={errors.categoryId}
          />

          <div className="space-y-2">
            <Label htmlFor="specialization-name">Nombre</Label>
            <Input
              id="specialization-name"
              value={formData.label}
              onChange={(event) => {
                setFormData((current) => ({
                  ...current,
                  label: event.target.value,
                }));
                setErrors((current) => ({ ...current, label: '' }));
              }}
              placeholder="Ej. Redes y conectividad"
              aria-invalid={Boolean(errors.label)}
            />
            {errors.label && <p className="text-xs text-destructive">{errors.label}</p>}
          </div>

          {message && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
              {message}
            </div>
          )}
          {errors.form && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.form}
            </div>
          )}

          <Button type="submit" size="lg" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving
              ? 'Procesando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Guardar especialización'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
