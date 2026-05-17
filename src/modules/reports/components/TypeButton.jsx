/**
 * TypeButton.jsx – Botón de selección con color temático (pill).
 *
 * Usado en ReportFilters para los filtros de tipo y riesgo.
 * Para el formulario de creación, usar SelectionGroup + SelectionButton
 * que proveen simetría de grilla.
 *
 * Props:
 *   id        {string}   ID único para accesibilidad y tests.
 *   label     {string}   Texto del botón.
 *   color     {string}   Color hex del tema (borde, texto, fondo al seleccionar).
 *   isSelected {boolean} Si el botón está activo.
 *   onClick   {Function} Handler de clic.
 *   fullWidth {boolean}  Si es true, ocupa el 100 % del ancho de su celda
 *                        (usado en mobile dentro de un grid de 2 columnas).
 */
export function TypeButton({ label, color, isSelected, onClick, id, fullWidth }) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      style={{
        borderColor:     color,
        backgroundColor: isSelected ? color : 'transparent',
        color:           isSelected ? '#ffffff' : color,
      }}
      className={[
        'cursor-pointer items-center gap-1.5 rounded-full border-2',
        'px-4 py-1.5 text-sm font-semibold transition-all duration-200',
        'hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'select-none',
        /* En mobile (grid) el botón expande al ancho de su celda;
           en sm+ (flex) vuelve al tamaño natural del pill. */
        fullWidth
          ? 'flex w-full justify-center sm:inline-flex sm:w-auto'
          : 'inline-flex',
      ].join(' ')}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
