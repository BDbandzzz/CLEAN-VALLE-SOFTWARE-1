import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';

export function UserTextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
