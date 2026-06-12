import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Search,
  Trash2,
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
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { EmptyState } from '@/core/components/ui/empty-state';
import { Input } from '@/core/components/ui/input';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { useLocationManagement } from '@/modules/locations-admin/context/LocationManagementContext';
import { showSuccessAlert } from '@/core/services/alertService';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function LocationsList({ onEdit }) {
  const {
    locations,
    isLoading,
    isMutating,
    error,
    deleteLocation,
  } = useLocationManagement();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [page, setPage] = useState(1);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const confirmation = CONFIRMATION_MESSAGES.locations.delete;

  const filteredLocations = useMemo(() => {
    const query = normalize(search);
    return locations.filter((location) => {
      const matchesStatus =
        (status === 'active' && location.active) ||
        (status === 'deleted' && !location.active);
      const matchesSearch = normalize([
        location.label,
        location.description,
        ...location.subareas.map((subarea) => subarea.label),
      ].join(' ')).includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [locations, search, status]);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / pageSize));
  const visibleLocations = filteredLocations.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const confirmDelete = async () => {
    if (!locationToDelete) return;
    try {
      await deleteLocation(locationToDelete.id);
      showSuccessAlert('La localización fue eliminada.');
      setLocationToDelete(null);
    } catch {
      // El contexto muestra el error.
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" />
          Localizaciones registradas
        </CardTitle>
        <CardDescription>
          Consulta lugares y las subáreas disponibles en cada uno.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar lugar o ubicación específica"
            className="pl-9"
          />
        </div>

        <div className="flex rounded-xl border border-border bg-muted/40 p-1">
          <SegmentedTabButton
            label="Activos"
            active={status === 'active'}
            onClick={() => { setStatus('active'); setPage(1); }}
          />
          <SegmentedTabButton
            label="Eliminados"
            active={status === 'deleted'}
            onClick={() => { setStatus('deleted'); setPage(1); }}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Cargando localizaciones...
          </div>
        )}
        {!isLoading && !filteredLocations.length && (
          <EmptyState
            title="No encontramos localizaciones"
            description="Crea un lugar o cambia la búsqueda."
            icon={<MapPin className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        <div className="space-y-3">
          {visibleLocations.map((location) => (
            <article
              key={location.id}
              className={`grid gap-4 rounded-lg border border-border p-4 lg:grid-cols-[1fr_auto] lg:items-center ${
                location.active ? '' : 'opacity-70'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground">{location.label}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      location.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {location.active ? 'Activo' : 'Eliminado'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {location.description || 'Sin descripción'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {location.subareas.map((subarea) => (
                    <span
                      key={subarea.id}
                      className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                    >
                      {subarea.label}
                    </span>
                  ))}
                </div>
              </div>
              {location.active && (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => onEdit(location)}>
                    <Pencil className="size-4" />
                    Modificar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setLocationToDelete(location)}
                    disabled={isMutating}
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </Button>
                </div>
              )}
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
        open={Boolean(locationToDelete)}
        {...confirmation}
        isLoading={isMutating}
        onAccept={confirmDelete}
        onReject={() => setLocationToDelete(null)}
      />
    </Card>
  );
}
