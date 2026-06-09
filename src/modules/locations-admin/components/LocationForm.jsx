import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { useLocationManagement } from '@/modules/locations-admin/context/LocationManagementContext';

const EMPTY_FORM = {
  label: '',
  description: '',
  subareas: [],
};

function mapLocationToForm(location) {
  if (!location) return EMPTY_FORM;
  return {
    label: location.label,
    description: location.description,
    subareas: location.subareas.map((subarea) => ({ ...subarea })),
  };
}

export function LocationForm({ location, onSaved }) {
  const { createLocation, updateLocation, isMutating } = useLocationManagement();
  const [formData, setFormData] = useState(() => mapLocationToForm(location));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [confirmSave, setConfirmSave] = useState(false);
  const isEditing = Boolean(location);
  const confirmation = isEditing
    ? CONFIRMATION_MESSAGES.locations.update(formData.label)
    : CONFIRMATION_MESSAGES.locations.create(formData.label);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setMessage('');
  };

  const addSubarea = () => {
    setFormData((current) => ({
      ...current,
      subareas: [
        ...current.subareas,
        {
          id: `subarea-${Date.now()}`,
          label: '',
          description: '',
        },
      ],
    }));
  };

  const updateSubarea = (id, field, value) => {
    setFormData((current) => ({
      ...current,
      subareas: current.subareas.map((subarea) =>
        subarea.id === id ? { ...subarea, [field]: value } : subarea
      ),
    }));
    setErrors((current) => ({ ...current, subareas: '' }));
  };

  const removeSubarea = (id) => {
    setFormData((current) => ({
      ...current,
      subareas: current.subareas.filter((subarea) => subarea.id !== id),
    }));
  };

  const reset = () => {
    setFormData(mapLocationToForm(location));
    setErrors({});
    setMessage('');
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.label.trim()) nextErrors.label = 'El nombre del lugar es obligatorio.';
    if (formData.subareas.some((subarea) => !subarea.label.trim())) {
      nextErrors.subareas = 'Todas las ubicaciones específicas deben tener nombre.';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return false;
    }
    return true;
  };

  const requestSave = (event) => {
    event.preventDefault();
    if (validateForm()) setConfirmSave(true);
  };

  const confirmSaveLocation = async () => {
    try {
      if (isEditing) {
        await updateLocation(location.id, formData);
        setMessage('La localización fue actualizada correctamente.');
      } else {
        await createLocation(formData);
        setFormData(EMPTY_FORM);
        setMessage('La localización fue creada correctamente.');
      }
      setErrors({});
      setConfirmSave(false);
      onSaved?.();
    } catch (error) {
      setErrors({ form: error.message });
      setMessage('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Modificar localización' : 'Crear localización'}</CardTitle>
        <CardDescription>
          Administra lugares y sus ubicaciones específicas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={requestSave} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location-name">Nombre</Label>
              <Input
                id="location-name"
                value={formData.label}
                onChange={(event) => updateField('label', event.target.value)}
                placeholder="Ej. Edificio principal"
                aria-invalid={Boolean(errors.label)}
              />
              {errors.label && <p className="text-xs text-destructive">{errors.label}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-description">Descripción</Label>
              <Input
                id="location-description"
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Descripción del lugar"
              />
            </div>
          </div>

          <section className="space-y-4 border-t border-border pt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">Ubicaciones específicas</h3>
                <p className="text-sm text-muted-foreground">
                  Subáreas asociadas al lugar principal.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={addSubarea}>
                <Plus className="size-4" />
                Añadir
              </Button>
            </div>

            {errors.subareas && (
              <p className="text-xs text-destructive">{errors.subareas}</p>
            )}

            <div className="space-y-3">
              {formData.subareas.map((subarea, index) => (
                <div
                  key={subarea.id}
                  className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_1fr_auto] md:items-end"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`subarea-name-${subarea.id}`}>Nombre</Label>
                    <Input
                      id={`subarea-name-${subarea.id}`}
                      value={subarea.label}
                      onChange={(event) =>
                        updateSubarea(subarea.id, 'label', event.target.value)
                      }
                      placeholder={`Ubicación ${index + 1}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`subarea-description-${subarea.id}`}>
                      Descripción
                    </Label>
                    <Input
                      id={`subarea-description-${subarea.id}`}
                      value={subarea.description}
                      onChange={(event) =>
                        updateSubarea(subarea.id, 'description', event.target.value)
                      }
                      placeholder="Contexto de la ubicación"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSubarea(subarea.id)}
                    aria-label="Quitar ubicación específica"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

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

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={isMutating}>
              <Save className="size-4" />
              {isMutating ? 'Procesando...' : isEditing ? 'Guardar cambios' : 'Guardar localización'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={reset}
              disabled={isMutating}
            >
              <RotateCcw className="size-4" />
              Restablecer
            </Button>
          </div>
        </form>
      </CardContent>

      <ConfirmationMessage
        open={confirmSave}
        {...confirmation}
        isLoading={isMutating}
        onAccept={confirmSaveLocation}
        onReject={() => setConfirmSave(false)}
      />
    </Card>
  );
}
