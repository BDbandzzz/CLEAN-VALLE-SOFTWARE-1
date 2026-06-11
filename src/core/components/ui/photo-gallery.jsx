import { ImageIcon } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { cn } from '@/core/lib/utils';

export function PhotoGallery({
  images = [],
  altPrefix = 'Evidencia',
  className = '',
  imageClassName = '',
  emptyText = '',
}) {
  if (!images.length) {
    return emptyText ? (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <ImageIcon className="size-4" />
        {emptyText}
      </p>
    ) : null;
  }

  return (
    <PhotoProvider maskOpacity={0.82}>
      <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4', className)}>
        {images.map((src, index) => (
          <PhotoView key={`${src}-${index}`} src={src}>
            <button
              type="button"
              className="group relative overflow-hidden rounded-lg border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Abrir ${altPrefix.toLowerCase()} ${index + 1}`}
            >
              <img
                src={src}
                alt={`${altPrefix} ${index + 1}`}
                loading="lazy"
                className={cn(
                  'aspect-square w-full object-cover transition duration-200 group-hover:scale-[1.03]',
                  imageClassName
                )}
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-left text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                Ver imagen
              </span>
            </button>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
