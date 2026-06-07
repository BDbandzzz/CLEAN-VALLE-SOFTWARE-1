import { Check, X } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import { cn } from '@/core/lib/utils';

export function MultiSelectField({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  error = '',
  description = '',
}) {
  const selectedOptions = options.filter((option) => value.includes(option.id));

  const toggleOption = (optionId) => {
    onChange(
      value.includes(optionId)
        ? value.filter((idValue) => idValue !== optionId)
        : [...value, optionId]
    );
  };

  return (
    <fieldset id={id} className="space-y-3">
      <div className="space-y-1">
        <Label asChild>
          <legend>
            {label}
            {required && <span className="text-destructive">*</span>}
          </legend>
        </Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => toggleOption(option.id)}
              className="h-auto min-h-7"
              title={`Quitar ${option.label}`}
            >
              {option.label}
              <X className="size-3.5" />
            </Button>
          ))}
        </div>
      )}

      <div
        className={cn(
          'grid gap-2 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-2',
          error && 'border-destructive'
        )}
      >
        {options.map((option) => {
          const selected = value.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleOption(option.id)}
              className={cn(
                'flex min-h-10 items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition',
                selected
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded border',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background'
                )}
              >
                {selected && <Check className="size-3.5" />}
              </span>
              <span className="font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </fieldset>
  );
}
