import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/core/lib/utils';

export function DashboardQuickActions({ actions = [] }) {
  return (
    <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md sm:min-h-28 sm:gap-4 sm:p-5"
        >
          <span
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
              action.iconClassName
            )}
          >
            <action.icon className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block break-words font-semibold leading-snug text-foreground">{action.title}</span>
            <span className="mt-1 block text-sm leading-5 text-muted-foreground">
              {action.description}
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      ))}
    </section>
  );
}
