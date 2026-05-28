import { LANDING_FLOW_SECTION, LANDING_FLOW_STEPS } from '@/modules/landing/constants/landingContent';
import { LandingSectionHeader } from './LandingSectionHeader';

export function LandingFlow() {
  return (
    <section id="flujo" className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <LandingSectionHeader {...LANDING_FLOW_SECTION} align="left" />

        <div className="grid gap-4 md:grid-cols-3">
          {LANDING_FLOW_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <article key={step.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
