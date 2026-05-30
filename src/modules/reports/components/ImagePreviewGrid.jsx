import { ImagePlus, X } from 'lucide-react';

import { Button } from '@/core/components/ui/button';

export function ImagePreviewGrid({ images, slotsLeft, onRemove, onAddMore }) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-5 gap-2 pt-1">
      {images.map((img, idx) => (
        <div
          key={img.previewUrl}
          className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
        >
          <img
            src={img.previewUrl}
            alt={`Foto ${idx + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition-colors duration-200 group-hover:bg-black/25">
            <Button
              type="button"
              onClick={() => onRemove(idx)}
              id={`remove-img-${idx}`}
              variant="ghost"
              size="icon-xs"
              className="size-5 rounded-full bg-black/70 text-white opacity-0 transition-all duration-200 hover:bg-red-600 hover:text-white group-hover:opacity-100"
              aria-label={`Eliminar foto ${idx + 1}`}
            >
              <X className="size-3" />
            </Button>
          </div>

          <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white">
            {idx + 1}
          </span>
        </div>
      ))}

      {slotsLeft > 0 && (
        <Button
          type="button"
          onClick={onAddMore}
          variant="ghost"
          className="flex aspect-square h-auto w-full flex-col rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors duration-200 hover:border-primary/50 hover:bg-muted hover:text-primary"
          aria-label="Agregar mas fotos"
        >
          <ImagePlus className="size-5" />
          <span className="mt-1 text-[10px] font-medium">+{slotsLeft}</span>
        </Button>
      )}
    </div>
  );
}

