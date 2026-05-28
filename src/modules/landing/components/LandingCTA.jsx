import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { LANDING_CTA } from '@/modules/landing/constants/landingContent';

export function LandingCTA() {
  return (
    <section id="acceso" className="px-4 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {LANDING_CTA.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {LANDING_CTA.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {LANDING_CTA.description}
          </p>
        </div>

        <Button asChild className="h-10 w-full gap-2 sm:w-fit">
          <Link to={LANDING_CTA.action.href}>
            {LANDING_CTA.action.label}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
