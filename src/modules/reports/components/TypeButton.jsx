/**
 * TypeButton – botón de selección con color temático para tipos de reporte y niveles de riesgo.
 */
export function TypeButton({ label, color, isSelected, onClick, id }) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      style={{
        borderColor: color,
        backgroundColor: isSelected ? color : 'transparent',
        color: isSelected ? '#ffffff' : color,
      }}
      className="
        inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2
        px-4 py-1.5 text-sm font-semibold transition-all duration-200
        hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
        select-none
      "
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
