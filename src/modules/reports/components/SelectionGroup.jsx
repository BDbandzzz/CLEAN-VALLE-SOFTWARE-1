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
        ── Grilla simétrica ──
        gridTemplateColumns con repeat(N, 1fr) garantiza que todos los botones
        tengan exactamente el mismo ancho, independientemente de la cantidad de ítems.
        Para agregar/quitar opciones, editar el arreglo en reportConstants.js.
      */}
      <div
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        className="grid gap-2 pt-1"
      >
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
