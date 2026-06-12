import {
  Bell,
  ClipboardCheck,
  Images,
  ListChecks,
} from 'lucide-react';

import { LANDING_CAPABILITIES } from '@/modules/landing/constants/landingContent';

const CAPABILITY_ICONS = {
  reports: ClipboardCheck,
  tracking: ListChecks,
  evidence: Images,
  notifications: Bell,
};

export function LandingCapabilities() {
  return (
    <section id="capacidades" className="border-b border-border bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground">
            Una gestión clara, desde el reporte hasta la solución
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            CleanValle organiza la atención de situaciones universitarias y mantiene
            informada a la comunidad durante todo el proceso.
          </p>
        </div>

        <div className="mt-8 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_CAPABILITIES.map((capability, index) => {
            const Icon = CAPABILITY_ICONS[capability.id];

            return (
              <article
                key={capability.id}
                className={[
                  'py-5 sm:px-5',
                  index > 0 ? 'border-t border-border sm:border-t-0' : '',
                  index % 2 ? 'sm:border-l sm:border-border' : '',
                  index > 1 ? 'lg:border-l lg:border-border' : '',
                  index === 2 ? 'sm:border-l-0' : '',
                ].join(' ')}
              >
                <Icon className="size-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {capability.title}
                </h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {capability.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
