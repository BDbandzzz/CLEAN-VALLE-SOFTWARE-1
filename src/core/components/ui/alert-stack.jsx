import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';

import { Button } from '@/core/components/ui/button';
import { ALERT_TYPES } from '@/core/constants/alertMessages';
import { cn } from '@/core/lib/utils';

const ALERT_META = {
  [ALERT_TYPES.ERROR]: {
    icon: AlertCircle,
    className: 'border-destructive/30 bg-card text-destructive',
    iconClassName: 'bg-destructive/10 text-destructive',
  },
  [ALERT_TYPES.SUCCESS]: {
    icon: CheckCircle2,
    className: 'border-emerald-300 bg-card text-emerald-700',
    iconClassName: 'bg-emerald-100 text-emerald-700',
  },
  [ALERT_TYPES.WARNING]: {
    icon: TriangleAlert,
    className: 'border-amber-300 bg-card text-amber-800',
    iconClassName: 'bg-amber-100 text-amber-800',
  },
  [ALERT_TYPES.INFO]: {
    icon: Info,
    className: 'border-primary/30 bg-card text-primary',
    iconClassName: 'bg-primary/10 text-primary',
  },
};

export function AlertStack({ alerts, onDismiss }) {
  if (!alerts.length) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-3 top-3 z-[70] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-full sm:max-w-sm"
      aria-live="polite"
      aria-atomic="false"
    >
      {alerts.map((alert) => {
        const meta = ALERT_META[alert.type] ?? ALERT_META.info;
        const Icon = meta.icon;

        return (
          <section
            key={alert.id}
            role={alert.type === ALERT_TYPES.ERROR ? 'alert' : 'status'}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg',
              meta.className
            )}
          >
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                meta.iconClassName
              )}
            >
              <Icon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              {alert.title && (
                <p className="text-sm font-semibold text-foreground">
                  {alert.title}
                </p>
              )}
              {alert.message && (
                <p className="mt-0.5 break-words text-sm leading-5 text-muted-foreground">
                  {alert.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDismiss(alert.id)}
              aria-label="Cerrar mensaje"
            >
              <X className="size-4" />
            </Button>
          </section>
        );
      })}
    </div>,
    document.body
  );
}

