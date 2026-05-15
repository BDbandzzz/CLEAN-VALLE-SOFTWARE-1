/**
 * ImagePreviewGrid
 * ----------------
 * Muestra las imágenes ya seleccionadas en una grilla de 5 columnas.
 * Cada thumbnail incluye un botón de eliminar que aparece al hacer hover.
 * Al final de la grilla se muestra un slot "+ N" si quedan espacios disponibles.
 *
 * Retorna null cuando no hay imágenes (no ocupa espacio en el DOM).
 *
 * NO maneja estado propio — recibe todo por props desde useImageUpload.
 *
 * Props:
 *   images    {Array<{ file: File, previewUrl: string }>}  Lista de imágenes cargadas.
 *   slotsLeft {number}    Slots disponibles restantes.
 *   onRemove  {Function}  Llamada con el índice de la imagen a eliminar.
 *   onAddMore {Function}  Llamada al hacer clic en el slot de "agregar más".
 */
import { ImagePlus, X } from 'lucide-react';

export function ImagePreviewGrid({ images, slotsLeft, onRemove, onAddMore }) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-5 gap-2 pt-1">

      {/* ── Thumbnails de imágenes cargadas ── */}
      {images.map((img, idx) => (
        <div
          key={img.previewUrl}
          className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
        >
          {/* Vista previa de la imagen */}
          <img
            src={img.previewUrl}
            alt={`Foto ${idx + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/*
            Overlay oscuro al hacer hover.
            Contiene el botón de eliminar que se revela con opacity-0 → opacity-100.
          */}
          <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition-colors duration-200 group-hover:bg-black/25">
            <button
              type="button"
              onClick={() => onRemove(idx)}
              id={`remove-img-${idx}`}
              className="
                flex size-5 items-center justify-center rounded-full
                bg-black/70 text-white opacity-0 transition-all duration-200
                hover:bg-red-600 group-hover:opacity-100
              "
              aria-label={`Eliminar foto ${idx + 1}`}
            >
              <X className="size-3" />
            </button>
          </div>

          {/* Etiqueta de posición (1, 2, 3…) */}
          <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white">
            {idx + 1}
          </span>
        </div>
      ))}

      {/*
        ── Slot de "agregar más" ──
        Solo visible cuando quedan slots disponibles.
        Actúa como acceso directo sin tener que scrollear hasta la drop zone.
      */}
      {slotsLeft > 0 && (
        <button
          type="button"
          onClick={onAddMore}
          className="
            flex aspect-square w-full cursor-pointer flex-col items-center justify-center
            rounded-xl border-2 border-dashed border-border bg-muted/40
            text-muted-foreground transition-colors duration-200
            hover:border-primary/50 hover:bg-muted hover:text-primary
          "
          aria-label="Agregar más fotos"
        >
          <ImagePlus className="size-5" />
          <span className="mt-1 text-[10px] font-medium">+{slotsLeft}</span>
        </button>
      )}
    </div>
  );
}
