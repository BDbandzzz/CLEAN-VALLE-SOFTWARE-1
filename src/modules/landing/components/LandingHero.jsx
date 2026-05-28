import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Leaf } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { APP_NAME, INSTITUTION_NAME, UNIVALLE_LOGO_SRC } from '@/core/constants/branding';
import { LANDING_HERO, LANDING_PREVIEW, LANDING_STATS } from '@/modules/landing/constants/landingContent';

function LandingStatCard({ icon, label, value }) {
  const StatIcon = icon;

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-primary-foreground shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-medium text-primary-foreground/80">
        <StatIcon className="size-4" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <img
            src={UNIVALLE_LOGO_SRC}
            alt={INSTITUTION_NAME}
            className="h-9 w-auto max-w-[120px] object-contain"
          />
          <div>
            <p className="text-sm font-bold text-foreground">{APP_NAME}</p>
            <p className="text-xs text-muted-foreground">{LANDING_HERO.statusLabel}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {LANDING_PREVIEW.status}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {LANDING_STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-muted/40 p-3">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
              <stat.icon className="size-4" />
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {LANDING_PREVIEW.rows.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-6 text-primary-foreground shadow-xl sm:p-8 lg:p-10">
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Leaf className="size-3.5" />
                {LANDING_HERO.eyebrow}
              </span>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {LANDING_HERO.title}
                </h1>
                <p className="max-w-xl text-sm leading-6 text-primary-foreground/85 sm:text-base">
                  {LANDING_HERO.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="h-10 bg-white text-emerald-800 hover:bg-white/90">
                  <Link to={LANDING_HERO.primaryAction.href}>
                    {LANDING_HERO.primaryAction.label}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-10 border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                  <a href={LANDING_HERO.secondaryAction.href}>{LANDING_HERO.secondaryAction.label}</a>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {LANDING_STATS.map((stat) => (
                <LandingStatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}
