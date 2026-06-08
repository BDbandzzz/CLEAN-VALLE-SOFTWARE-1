import { Palette } from 'lucide-react';

import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { cn } from '@/core/lib/utils';

export function ColorField({
  id,
  label,
  value,
  onChange,
  required = false,
  error = '',
  className = '',
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="grid grid-cols-[44px_1fr] gap-2">
        <label
          htmlFor={`${id}-picker`}
          className="flex h-9 cursor-pointer items-center justify-center rounded-lg border border-input bg-background"
          title="Seleccionar color"
        >
          <Palette className="size-4" style={{ color: value || '#0f766e' }} />
          <input
            id={`${id}-picker`}
            type="color"
            value={value || '#0f766e'}
            onChange={(event) => onChange(event.target.value)}
            className="sr-only"
          />
        </label>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#0f766e"
          aria-invalid={Boolean(error)}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
