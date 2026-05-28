import { FormField } from './FormField';
import { formControlClass } from './formStyles';

export function TextareaField({
  id,
  label,
  required = false,
  icon,
  error,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  showCounter = Boolean(maxLength),
}) {
  return (
    <FormField id={id} label={label} required={required} icon={icon} error={error}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={formControlClass(error, 'resize-none')}
      />
      {showCounter && maxLength && (
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {value.length}/{maxLength}
        </p>
      )}
    </FormField>
  );
}
