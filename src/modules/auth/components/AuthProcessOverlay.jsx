import { LoaderCircle } from 'lucide-react';

export function AuthProcessOverlay({ title, description }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-7 text-center shadow-xl">
        <LoaderCircle className="mx-auto size-9 animate-spin text-primary" />
        <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
