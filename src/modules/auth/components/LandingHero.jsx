/**
 * LandingHero.jsx – Sección principal (hero) de la landing page.
 *
 * Muestra:
 *   - Badge institucional.
 *   - Título y subtítulo desde landingContent.js.
 *   - Botones CTA: "Entrar a la plataforma" y "Sitio Univalle".
 *   - Chips de estadísticas (StatBadge).
 *   - Card con el logo de la institución.
 *
 * Para editar los textos: src/core/constants/landingContent.js (LANDING_HERO).
 * Para editar los stats: modificar el arreglo STATS en este archivo.
 */
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Shield, BarChart3, Bell } from 'lucide-react';
import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import { LANDING_HERO } from '@/core/constants/landingContent';

/** Estadísticas visibles bajo los CTAs. */
const STATS = [
  { icon: BarChart3, label: 'Reportes activos',      value: '120+' },
  { icon: Shield,    label: 'Roles de acceso',        value: '4'    },
  { icon: Bell,      label: 'Alertas en tiempo real', value: '24/7' },
];

/** Chip numérico de estadística: ícono + valor + etiqueta. */
function StatBadge({ icon, label, value }) {
  const StatIcon = icon;
  return (
    <div className="flex min-w-[90px] flex-col items-center rounded-xl border border-border bg-card px-5 py-4">
      <StatIcon size={18} className="mb-1 text-primary" />
      <span className="text-lg font-extrabold text-foreground">{value}</span>
      <span className="mt-0.5 text-center text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/** Card con el logo de la institución e indicador de estado. */
function HeroLogoCard() {
  return (
    <div className="flex flex-1 justify-center">
      <div className="flex w-full max-w-[260px] flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 shadow-md">
        <img
          src={UNIVALLE_LOGO_SRC}
          alt={INSTITUTION_NAME}
          className="h-20 w-auto max-w-[200px] object-contain"
        />
        <div className="h-px w-full bg-border" />
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{INSTITUTION_NAME}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{APP_NAME}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold text-primary">Sistema activo</span>
        </div>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex flex-col items-center gap-12 lg:flex-row">

        {/* Columna de texto */}
        <div className="flex max-w-xl flex-col gap-5">

          {/* Badge institucional */}
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-1">
            <Leaf size={13} className="text-primary" />
            <span className="text-xs font-semibold text-secondary-foreground">
              Plataforma institucional · Univalle
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground">
            {LANDING_HERO.title}
          </h1>

          {/* Subtítulo */}
          <p className="text-base leading-relaxed text-muted-foreground">
            {LANDING_HERO.subtitle}
          </p>

          {/* Botones CTA */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground no-underline transition-opacity hover:opacity-90"
            >
              Entrar a la plataforma
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://www.univalle.edu.co"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground no-underline transition-colors hover:border-primary hover:text-primary"
            >
              Sitio Univalle
            </a>
          </div>

          {/* Chips de estadísticas */}
          <div className="flex flex-wrap gap-3 pt-1">
            {STATS.map((s) => (
              <StatBadge key={s.label} {...s} />
            ))}
          </div>

        </div>

        {/* Card con logo */}
        <HeroLogoCard />

      </div>
    </section>
  );
}
