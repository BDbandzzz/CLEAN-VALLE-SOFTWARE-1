import { Tags } from 'lucide-react';

export function OperatorSpecializations({ specializations = [] }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3 sm:w-56 sm:shrink-0">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Tags className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold text-foreground">Especializaciones</h2>
          <p className="text-xs text-muted-foreground">Áreas asignadas a tu perfil</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        {specializations.length ? (
          specializations.map((specialization) => (
            <span
              key={specialization}
              className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-sm font-medium text-primary"
            >
              {specialization}
            </span>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No tienes especializaciones asignadas.
          </p>
        )}
      </div>
    </section>
  );
}
