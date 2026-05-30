import { SelectionOptionButton } from '@/modules/reports/components/SelectionOptionButton';
import {label} from '@/core/components/ui/label';

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
        <label className="flex items-center gap-3.5 text-sm font-medium text-foreground">
          {icon}
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className={`grid grid-cols-1 ${smColsClass(items.length)} gap-2 pt-1`}>
        {items.map((item) => (
        <div key={item.id} className="min-w-0">
          <SelectionOptionButton
            key={item.id}
            id={`${idPrefix}-${item.id}`}
            label={item.label}
            description={item.description}
            color={item.color}
            isSelected={selected === item.id}
            disabled={disabled}
            onClick={() => onSelect(item.id)}
          />
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
