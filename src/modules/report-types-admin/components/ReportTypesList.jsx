import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Power,
  RotateCcw,
  Search,
  Tags,
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
import { Label } from '@/core/components/ui/label';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { useReportTypeManagement } from '@/modules/report-types-admin/context/ReportTypeManagementContext';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function ReportTypesList({ onEditType }) {
  const {
    reportTypes,
    isLoading,
    isMutating,
    error,
    setReportTypeActive,
  } = useReportTypeManagement();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [typeToToggle, setTypeToToggle] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const counts = useMemo(
    () => ({
      all: reportTypes.length,
      active: reportTypes.filter((type) => type.active !== false).length,
      inactive: reportTypes.filter((type) => type.active === false).length,
    }),
    [reportTypes]
  );

  const filteredTypes = useMemo(() => {
    const query = normalize(search);
    return reportTypes.filter((type) => {
      const isActive = type.active !== false;
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && isActive) ||
        (status === 'inactive' && !isActive);
      const searchableText = normalize([
        type.label,
        type.description,
        ...(type.subtypes ?? []).map((subtype) => subtype.label),
      ].join(' '));

      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [reportTypes, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredTypes.length / pageSize));
  const visibleTypes = filteredTypes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const confirmToggle = async () => {
    if (!typeToToggle) return;
    try {
      await setReportTypeActive(typeToToggle.id, typeToToggle.active === false);
      setTypeToToggle(null);
    } catch {
      // El contexto muestra el error del servicio.
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="size-5 text-primary" />
          Tipos registrados
        </CardTitle>
        <CardDescription>
          Busca, modifica y controla disponibilidad de tipos y razones.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="report-type-search">Buscar tipos o razones</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="report-type-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Tipo, descripción o razón específica"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex rounded-xl border border-border bg-muted/40 p-1">
          <SegmentedTabButton label="Todos" count={counts.all} active={status === 'all'} onClick={() => { setStatus('all'); setPage(1); }} />
          <SegmentedTabButton label="Activos" count={counts.active} active={status === 'active'} onClick={() => { setStatus('active'); setPage(1); }} />
          <SegmentedTabButton label="Inactivos" count={counts.inactive} active={status === 'inactive'} onClick={() => { setStatus('inactive'); setPage(1); }} />
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Cargando tipos de reporte...
          </div>
        )}

        {!isLoading && !filteredTypes.length && (
          <EmptyState
            title="No encontramos tipos"
            description="Prueba otra búsqueda o cambia el filtro."
            icon={<Search className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        <div className="space-y-3">
          {!isLoading && visibleTypes.map((type) => {
            const isActive = type.active !== false;

            return (
              <article
                key={type.id}
                className={`grid gap-4 rounded-lg border border-border bg-background/80 p-4 lg:grid-cols-[1fr_auto] lg:items-center ${
                  isActive ? '' : 'opacity-70'
                }`}
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ColorPill label={type.label} color={type.color} />
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {type.subtypes.length} {type.subtypes.length === 1 ? 'razón' : 'razones'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {type.subtypes.map((subtype) => (
                      <span
                        key={subtype.id}
                        className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {subtype.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Button type="button" variant="outline" onClick={() => onEditType?.(type)}>
                    <Pencil className="size-4" />
                    Modificar
                  </Button>
                  <Button
                    type="button"
                    variant={isActive ? 'destructive' : 'outline'}
                    onClick={() => setTypeToToggle(type)}
                    disabled={isMutating}
                  >
                    {isActive ? <Power className="size-4" /> : <RotateCcw className="size-4" />}
                    {isActive ? 'Deshabilitar' : 'Reactivar'}
                  </Button>
                </div>
              </article>
            );
          })}
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
        open={Boolean(typeToToggle)}
        title={typeToToggle?.active === false ? 'Reactivar tipo de reporte' : 'Deshabilitar tipo de reporte'}
        reason={
          typeToToggle?.active === false
            ? 'El tipo y sus razones volverán a estar disponibles.'
            : 'El tipo y todas sus razones asociadas quedarán deshabilitadas.'
        }
        acceptLabel={typeToToggle?.active === false ? 'Reactivar' : 'Deshabilitar'}
        rejectLabel="Cancelar"
        variant={typeToToggle?.active === false ? 'default' : 'destructive'}
        isLoading={isMutating}
        onAccept={confirmToggle}
        onReject={() => setTypeToToggle(null)}
      />
    </Card>
  );
}
