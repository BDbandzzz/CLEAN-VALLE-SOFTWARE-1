import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Search,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import {
  APP_NAME,
  INSTITUTION_NAME,
  UNIVALLE_LOGO_SRC,
} from '@/core/constants/branding';
import {
  LANDING_FLOW_STEPS,
  LANDING_HERO,
} from '@/modules/landing/constants/landingContent';

const STEP_ICONS = [ClipboardList, Search, Wrench];

export function LandingHero() {
  return (
    <section className="px-4 pb-8 pt-6 sm:px-6 sm:pb-10 lg:px-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl flex-col justify-between overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground shadow-xl sm:px-10 sm:py-10 lg:px-14">
        <img
          src={UNIVALLE_LOGO_SRC}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-1/2 w-[280px] -translate-y-1/2 opacity-[0.08] sm:w-[390px] lg:right-8 lg:w-[480px]"
        />

        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold text-primary-foreground/75">
            {INSTITUTION_NAME}
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {APP_NAME}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/85 sm:text-lg">
            {LANDING_HERO.subtitle}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="secondary"
              className="h-10 bg-white text-primary hover:bg-white/90"
            >
              <Link to={LANDING_HERO.primaryAction.href}>
                {LANDING_HERO.primaryAction.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to={LANDING_HERO.secondaryAction.href}>
                {LANDING_HERO.secondaryAction.label}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-10 grid border-t border-white/20 pt-6 sm:grid-cols-3">
          {LANDING_FLOW_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? CheckCircle2;
            return (
              <div
                key={step.title}
                className="flex items-start gap-3 border-white/15 py-3 sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/12">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-primary-foreground/70">
                    {step.description}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
