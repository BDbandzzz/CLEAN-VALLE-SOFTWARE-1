import { CheckCircle2 } from 'lucide-react';

function smColsClass(count) {
  const map = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 lg:grid-cols-3',
    6: 'sm:grid-cols-2 lg:grid-cols-3',
  };

  return map[count] ?? 'sm:grid-cols-2 lg:grid-cols-3';
}

export function SelectionGroup({
  label,
  icon,
  required,
  items,
  idPrefix,
  selected,
  onSelect,
  error,
  disabled = false,
  hideLabel = false,
}) {
  return (
    <div className="space-y-1.5">
      {!hideLabel && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {icon}
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className={`grid grid-cols-1 ${smColsClass(items.length)} gap-2 pt-1`}>
        {items.map((item) => (
          <SelectionButton
            key={item.id}
            id={`${idPrefix}-${item.id}`}
            label={item.label}
            description={item.description}
            color={item.color}
            isSelected={selected === item.id}
            disabled={disabled}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectionButton({ id, label, description, color, isSelected, disabled, onClick }) {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isSelected}
      style={{
        borderColor: isSelected ? color : `${color}44`,
        backgroundColor: isSelected ? `${color}12` : 'hsl(var(--card))',
        boxShadow: isSelected ? `0 0 0 3px ${color}22` : 'none',
      }}
      className="
        flex min-h-[4.75rem] w-full cursor-pointer items-start gap-3 rounded-xl border
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
    </button>
  );
}
