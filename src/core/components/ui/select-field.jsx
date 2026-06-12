import { ChevronDown } from 'lucide-react';

import { Label } from '@/core/components/ui/label';
import { cn } from '@/core/lib/utils';

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecciona una opción',
  required = false,
  error = '',
  disabled = false,
  className = '',
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none transition',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20'
          )}
        >
          <option value="">{placeholder}</option>
          {(Array.isArray(options) ? options : []).map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
