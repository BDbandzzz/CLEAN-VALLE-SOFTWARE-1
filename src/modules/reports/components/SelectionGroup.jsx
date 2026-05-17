/**
 * SelectionGroup
 * --------------
 * Renderiza un grupo de botones de selección exclusiva dispuestos en una grilla
 * CSS simétrica: todos los botones tienen exactamente el mismo ancho sin importar
 * cuántos sean ni cuán largo sea su texto.
 *
 * Usado para "Tipo de reporte" y "Nivel de riesgo" en el formulario de reporte.
 *
 * Props:
 *   label     {string}      Texto de la etiqueta del grupo.
 *   icon      {ReactNode}   Ícono mostrado junto a la etiqueta.
 *   required  {boolean}     Si es true, muestra asterisco rojo tras la etiqueta.
 *   items     {Array<{ id: string, label: string, color: string }>}
 *             Lista de opciones a mostrar.
 *   idPrefix  {string}      Prefijo para los IDs de cada botón (ej: "type" → "type-basura").
 *   selected  {string}      ID del ítem actualmente seleccionado.
 *   onSelect  {Function}    Callback llamado con el id del ítem al hacer clic.
 *   error     {string}      Mensaje de error de validación. Vacío = sin error.
 */
/**
 * Devuelve la clase `sm:grid-cols-N` correspondiente al número de ítems,
 * permitiendo que en mobile siempre se usen 2 columnas (nunca se solapan)
 * y en pantallas ≥640 px se expanda al ancho real del arreglo.
 */
function smColsClass(count) {
  const map = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
  };
  return map[count] ?? 'sm:grid-cols-4';
}

export function SelectionGroup({ label, icon, required, items, idPrefix, selected, onSelect, error }) {
  return (
    <div className="space-y-1.5">

      {/* ── Etiqueta del grupo ── */}
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>

      {/*
        ── Grilla responsiva ──
        Mobile (< 640 px): siempre 2 columnas → los botones nunca se solapan.
        sm+ (≥ 640 px):    tantas columnas como ítems haya en el arreglo,
                           manteniendo la simetría original.
        Para agregar/quitar opciones, editar el arreglo en reportConstants.js.
      */}
      <div className={`grid grid-cols-2 ${smColsClass(items.length)} gap-2 pt-1`}>
        {items.map((item) => (
          <SelectionButton
            key={item.id}
            id={`${idPrefix}-${item.id}`}
            label={item.label}
            color={item.color}
            isSelected={selected === item.id}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>

      {/* ── Error de validación ── */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SelectionButton – botón individual dentro de SelectionGroup.

   Ocupa el 100% del ancho de su celda de la grilla (w-full).
   El color de fondo, borde y texto se controla por la prop `color` (hex).
   Al seleccionarse muestra un glow ring del mismo color con 20% de opacidad.
───────────────────────────────────────────────────────────────────────────── */
function SelectionButton({ id, label, color, isSelected, onClick }) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      aria-pressed={isSelected}
      style={{
        borderColor:     color,
        backgroundColor: isSelected ? color : 'transparent',
        color:           isSelected ? '#ffffff' : color,
        boxShadow:       isSelected ? `0 0 0 3px ${color}33` : 'none',
      }}
      className="
        flex w-full cursor-pointer items-center justify-center gap-2
        rounded-xl border-2 py-2.5 text-sm font-semibold
        transition-all duration-200 hover:opacity-85 select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
      "
    >
      {/* Punto indicador de color — blanco cuando está seleccionado */}
      <span
        style={{ backgroundColor: isSelected ? '#ffffff' : color }}
        className="size-2 shrink-0 rounded-full transition-colors duration-200"
      />
      {label}
    </button>
  );
}
