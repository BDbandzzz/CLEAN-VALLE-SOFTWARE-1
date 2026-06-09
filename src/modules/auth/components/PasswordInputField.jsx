import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';

export function PasswordInputField({
  id,
  label,
  value,
  visible,
  onChange,
  onToggle,
  placeholder = '',
  autoComplete = 'current-password',
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="pr-11"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
          title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
