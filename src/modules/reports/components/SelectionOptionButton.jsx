import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/core/components/ui/button';

export function SelectionOptionButton({
  id,
  label,
  description,
  color,
  isSelected,
  disabled,
  onClick,
}) {
  return (
    <Button
      type="button"
      id={id}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isSelected}
      variant="ghost"
      style={{
        borderColor: isSelected ? color : `${color}44`,
        backgroundColor: isSelected ? `${color}12` : 'hsl(var(--card))',
        boxShadow: isSelected ? `0 0 0 3px ${color}22` : 'none',
      }}
      className="
        h-auto min-h-[4.75rem] w-full items-start gap-3 rounded-xl border
        px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5
        hover:border-primary/50 hover:bg-emerald-50/70 disabled:pointer-events-none
        disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        focus-visible:ring-offset-1
      "
    >
      <span
        className="mt-1 size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-semibold leading-snug text-foreground">
          {label}
        </span>
        {description && (
          <span className="mt-1 block break-words text-xs leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {isSelected && (
        <CheckCircle2
          className="mt-0.5 size-4 shrink-0"
          style={{ color }}
          aria-hidden="true"
        />
      )}
    </Button>
  );
}

