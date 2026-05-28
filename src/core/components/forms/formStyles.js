export function formControlClass(hasError, extraClassName = '') {
  return [
    'w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm transition',
    'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
    hasError ? 'border-destructive focus:ring-destructive/40' : 'border-input',
    extraClassName,
  ].filter(Boolean).join(' ');
}
