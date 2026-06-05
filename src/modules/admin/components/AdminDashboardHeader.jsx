import { ShieldCheck } from 'lucide-react';

export function AdminDashboardHeader({ activeReports, pendingReviews }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-emerald-700 via-primary to-teal-700 p-8 text-primary-foreground shadow-xl">
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15">
            <ShieldCheck className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Panel administrador</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Vista general de usuarios, reportes y catalogos operativos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
