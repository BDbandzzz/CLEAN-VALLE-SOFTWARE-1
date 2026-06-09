import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Power,
  RotateCcw,
  Search,
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
import { useLocationManagement } from '@/modules/locations-admin/context/LocationManagementContext';

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
    setLocationActive,
  } = useLocationManagement();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [locationToToggle, setLocationToToggle] = useState(null);

  const filteredLocations = useMemo(() => {
    const query = normalize(search);
    return locations.filter((location) => {
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && location.active) ||
        (status === 'inactive' && !location.active);
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

  const confirmToggle = async () => {
    if (!locationToToggle) return;
    try {
      await setLocationActive(
        locationToToggle.id,
        locationToToggle.active === false
      );
      setLocationToToggle(null);
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
            label="Todos"
            active={status === 'all'}
            onClick={() => { setStatus('all'); setPage(1); }}
          />
          <SegmentedTabButton
            label="Activos"
            active={status === 'active'}
            onClick={() => { setStatus('active'); setPage(1); }}
          />
          <SegmentedTabButton
            label="Inactivos"
            active={status === 'inactive'}
            onClick={() => { setStatus('inactive'); setPage(1); }}
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
                    {location.active ? 'Activo' : 'Inactivo'}
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
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => onEdit(location)}>
                  <Pencil className="size-4" />
                  Modificar
                </Button>
                <Button
                  type="button"
                  variant={location.active ? 'destructive' : 'outline'}
                  onClick={() => setLocationToToggle(location)}
                  disabled={isMutating}
                >
                  {location.active ? (
                    <Power className="size-4" />
                  ) : (
                    <RotateCcw className="size-4" />
                  )}
                  {location.active ? 'Desactivar' : 'Reactivar'}
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
        open={Boolean(locationToToggle)}
        title={
          locationToToggle?.active ? 'Desactivar localización' : 'Reactivar localización'
        }
        reason={
          locationToToggle?.active
            ? 'El lugar dejará de estar disponible al crear reportes.'
            : 'El lugar volverá a estar disponible al crear reportes.'
        }
        acceptLabel={locationToToggle?.active ? 'Desactivar' : 'Reactivar'}
        rejectLabel="Cancelar"
        variant={locationToToggle?.active ? 'destructive' : 'default'}
        isLoading={isMutating}
        onAccept={confirmToggle}
        onReject={() => setLocationToToggle(null)}
      />
    </Card>
  );
}
