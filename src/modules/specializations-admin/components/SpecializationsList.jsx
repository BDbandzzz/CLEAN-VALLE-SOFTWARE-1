import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
  Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ColorPill } from '@/core/components/ui/color-pill';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { EmptyState } from '@/core/components/ui/empty-state';
import { Input } from '@/core/components/ui/input';
import { SelectField } from '@/core/components/ui/select-field';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { deleteManagedSpecialization } from '@/services/adminSpecializationService';
import { showErrorAlert, showSuccessAlert } from '@/core/services/alertService';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function SpecializationsList({
  specializations,
  categories,
  isLoading,
  isSaving,
  setIsSaving,
  error,
  onEdit,
  onChanged,
}) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [specializationToDelete, setSpecializationToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const filtered = useMemo(() => {
    const query = normalize(search);
    return specializations.filter((specialization) => {
      const matchesCategory =
        !categoryId || Number(specialization.categoryId) === Number(categoryId);
      const matchesSearch = normalize(
        `${specialization.label} ${specialization.categoryName}`
      ).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [categoryId, search, specializations]);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleSpecializations = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const confirmDelete = async () => {
    if (!specializationToDelete) return;
    setIsSaving(true);
    setDeleteError('');
    try {
      await deleteManagedSpecialization(specializationToDelete.id);
      setSpecializationToDelete(null);
      showSuccessAlert('La especialización fue eliminada.');
      await onChanged();
    } catch (operationError) {
      setDeleteError(operationError.message);
      showErrorAlert(operationError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="size-5 text-primary" />
          Especializaciones registradas
        </CardTitle>
        <CardDescription>
          Capacidades disponibles para asignar a operadores.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="relative self-end">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar especialización"
              className="pl-9"
            />
          </div>
          <SelectField
            id="specialization-category-filter"
            label="Categoría"
            value={categoryId}
            options={categories}
            placeholder="Todas las categorías"
            onChange={(event) => {
              setCategoryId(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {(error || deleteError) && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error || deleteError}
          </div>
        )}
        {isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Cargando especializaciones...
          </div>
        )}
        {!isLoading && !filtered.length && (
          <EmptyState
            title="No hay especializaciones"
            description="Crea la primera especialización para operadores."
            icon={<Wrench className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        <div className="space-y-3">
          {visibleSpecializations.map((specialization) => (
            <article
              key={specialization.id}
              className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  {specialization.label}
                </h3>
                <ColorPill
                  label={specialization.categoryName || 'Sin categoría'}
                  color={specialization.categoryColor}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onEdit(specialization)}
                >
                  <Pencil className="size-4" />
                  Modificar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setSpecializationToDelete(specialization)}
                  disabled={isSaving}
                >
                  <Trash2 className="size-4" />
                  Eliminar
                </Button>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages}
                aria-label="Página siguiente"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <ConfirmationMessage
        open={Boolean(specializationToDelete)}
        {...CONFIRMATION_MESSAGES.specializations.delete}
        isLoading={isSaving}
        onAccept={confirmDelete}
        onReject={() => setSpecializationToDelete(null)}
      />
    </Card>
  );
}
