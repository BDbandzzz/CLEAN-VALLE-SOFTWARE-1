import { cn } from '@/core/lib/utils';
import { LANDING_FEATURE_SECTION, LANDING_FEATURES } from '@/modules/landing/constants/landingContent';
import { LANDING_FEATURE_TONES } from '@/modules/landing/constants/landingStyles';
import { LandingSectionHeader } from './LandingSectionHeader';

function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className={cn('flex size-11 items-center justify-center rounded-xl', LANDING_FEATURE_TONES[feature.tone])}>
          <Icon className="size-5" />
        </div>
        <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {feature.label}
        </span>
      </div>
      <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
    </article>
  );
}

export function LandingFeatures() {
  return (
    <section id="capacidades" className="border-y border-border bg-background px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <LandingSectionHeader {...LANDING_FEATURE_SECTION} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
