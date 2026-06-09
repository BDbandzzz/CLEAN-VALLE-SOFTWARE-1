import { AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { Button } from '@/core/components/ui/button';
import { cn } from '@/core/lib/utils';

export function ConfirmationMessage({
  open,
  title,
  reason,
  acceptLabel = 'Aceptar',
  rejectLabel = 'Rechazar',
  onAccept,
  onReject,
  variant = 'default',
  isLoading = false,
  className = '',
}) {
  if (!open) return null;

  const isDestructive = variant === 'destructive';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onReject?.();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-reason"
        className={cn(
          'w-full max-w-md rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl',
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-lg',
              isDestructive
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary'
            )}
          >
            <AlertTriangle className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirmation-title" className="text-lg font-semibold leading-6 text-foreground">
                {title}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onReject}
                disabled={isLoading}
                aria-label={rejectLabel}
              >
                <X className="size-4" />
              </Button>
            </div>

            {reason && (
              <p id="confirmation-reason" className="mt-2 text-sm leading-6 text-muted-foreground">
                {reason}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onReject} disabled={isLoading}>
            {rejectLabel}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? 'destructive' : 'default'}
            onClick={onAccept}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : acceptLabel}
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
}
