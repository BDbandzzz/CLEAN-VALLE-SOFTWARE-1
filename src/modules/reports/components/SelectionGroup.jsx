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

function SelectionButton({ id, label, color, isSelected, disabled, onClick }) {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isSelected}
      style={{
        borderColor: color,
        backgroundColor: isSelected ? color : 'transparent',
        color: isSelected ? '#ffffff' : color,
        boxShadow: isSelected ? `0 0 0 3px ${color}33` : 'none',
      }}
      className="
        flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl border-2
        px-3 py-2 text-center text-xs font-semibold leading-snug transition-all duration-200
        hover:opacity-85 disabled:pointer-events-none disabled:opacity-50 sm:text-sm
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
      "
    >
      <span className="block max-w-full whitespace-normal break-words">{label}</span>
    </button>
  );
}
