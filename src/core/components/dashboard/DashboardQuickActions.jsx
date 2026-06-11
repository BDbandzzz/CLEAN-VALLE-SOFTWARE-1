import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/core/lib/utils';

export function DashboardQuickActions({ actions = [] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="group flex min-h-28 items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
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
            <span className="block font-semibold text-foreground">{action.title}</span>
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
