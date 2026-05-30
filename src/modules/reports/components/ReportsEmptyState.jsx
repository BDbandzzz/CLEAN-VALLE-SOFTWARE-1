import { FileSearch } from 'lucide-react';

export function ReportsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <FileSearch className="size-12 text-muted-foreground/50" />
      <p className="mt-4 text-base font-medium text-muted-foreground">
        No se encontraron reportes
      </p>
      <p className="mt-1 text-sm text-muted-foreground/70">
        Crea un reporte o ajusta los filtros activos.
      </p>
    </div>
  );
}

