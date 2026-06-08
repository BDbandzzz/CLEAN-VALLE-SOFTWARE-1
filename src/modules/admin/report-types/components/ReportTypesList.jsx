import { Pencil, Power, RotateCcw, Search, Tags } from 'lucide-react';
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
import { useReportTypeManagement } from '@/modules/admin/report-types/context/ReportTypeManagementContext';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function ReportTypesList({ onEditType }) {
  const { reportTypes, setReportTypeActive } = useReportTypeManagement();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [typeToToggle, setTypeToToggle] = useState(null);

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

  const confirmToggle = () => {
    if (!typeToToggle) return;
    setReportTypeActive(typeToToggle.id, typeToToggle.active === false);
    setTypeToToggle(null);
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tipo, descripción o razón específica"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex rounded-xl border border-border bg-muted/40 p-1">
          <SegmentedTabButton label="Todos" count={counts.all} active={status === 'all'} onClick={() => setStatus('all')} />
          <SegmentedTabButton label="Activos" count={counts.active} active={status === 'active'} onClick={() => setStatus('active')} />
          <SegmentedTabButton label="Inactivos" count={counts.inactive} active={status === 'inactive'} onClick={() => setStatus('inactive')} />
        </div>

        {!filteredTypes.length && (
          <EmptyState
            title="No encontramos tipos"
            description="Prueba otra búsqueda o cambia el filtro."
            icon={<Search className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        <div className="space-y-3">
          {filteredTypes.map((type) => {
            const isActive = type.active !== false;
            const activeSubtypes = type.subtypes.filter((subtype) => subtype.active !== false).length;

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
                      {activeSubtypes}/{type.subtypes.length} razones activas
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {type.subtypes.map((subtype) => (
                      <span
                        key={subtype.id}
                        className={`rounded-md bg-muted px-2 py-1 text-xs font-medium ${
                          subtype.active === false ? 'text-muted-foreground/60 line-through' : 'text-muted-foreground'
                        }`}
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
                  >
                    {isActive ? <Power className="size-4" /> : <RotateCcw className="size-4" />}
                    {isActive ? 'Deshabilitar' : 'Reactivar'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
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
        onAccept={confirmToggle}
        onReject={() => setTypeToToggle(null)}
      />
    </Card>
  );
}
