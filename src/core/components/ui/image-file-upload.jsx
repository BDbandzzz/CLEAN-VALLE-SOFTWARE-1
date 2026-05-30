import { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';

import { Button } from '@/core/components/ui/button';

function isAcceptedImage(file) {
  return file?.type?.startsWith('image/');
}

export function ImageFileUpload({
  files = [],
  onChange,
  maxFiles = 5,
  maxMb = 10,
  disabled = false,
  label = 'Evidencia fotografica',
  optional = true,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const maxBytes = maxMb * 1024 * 1024;

  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const slotsLeft = Math.max(0, maxFiles - files.length);

  const applyNewFiles = (incomingList) => {
    const incoming = Array.from(incomingList ?? []);
    if (!incoming.length || disabled) return;

    const next = [...files];
    const errors = [];

    for (const file of incoming) {
      if (next.length >= maxFiles) {
        errors.push(`Maximo ${maxFiles} imagenes.`);
        break;
      }
      if (!isAcceptedImage(file)) {
        errors.push(`"${file.name}" no es una imagen valida.`);
        continue;
      }
      if (file.size > maxBytes) {
        errors.push(`"${file.name}" supera ${maxMb} MB.`);
        continue;
      }
      next.push(file);
    }

    onChange(next);
    setError(errors[0] ?? '');
  };

  const removeAt = (index) => {
    const next = files.filter((_, idx) => idx !== index);
    onChange(next);
    setError('');
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    applyNewFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <ImagePlus className="size-4" />
          {label}
          {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(opcional)</span>}
        </label>
        <span className="text-xs text-muted-foreground">{files.length}/{maxFiles} fotos</span>
      </div>

      {slotsLeft > 0 && (
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openPicker();
            }
          }}
          className={[
            'cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition',
            isDragging ? 'border-primary bg-emerald-50/70' : 'border-border bg-muted/20 hover:border-primary/50',
            disabled ? 'pointer-events-none opacity-60' : '',
          ].join(' ')}
        >
          <Upload className="mx-auto size-5 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">Arrastra imagenes aqui o da clic para seleccionar</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG/JPG/WebP hasta {maxMb} MB por archivo</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={disabled}
            className="hidden"
            onChange={(event) => {
              applyNewFiles(event.target.files);
              event.target.value = '';
            }}
          />
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {previews.length > 0 && (
        <div className="grid grid-cols-5 gap-2 pt-1">
          {previews.map((preview, index) => (
            <div
              key={`${preview.file.name}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
            >
              <button
                type="button"
                onClick={() => window.open(preview.url, '_blank', 'noopener,noreferrer')}
                className="h-full w-full"
                aria-label={`Ver foto ${index + 1}`}
              >
                <img
                  src={preview.url}
                  alt={`Foto ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>

              <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition-colors duration-200 group-hover:bg-black/25">
                <Button
                  type="button"
                  onClick={() => removeAt(index)}
                  variant="ghost"
                  size="icon-xs"
                  className="size-5 rounded-full bg-black/70 text-white opacity-0 transition-all duration-200 hover:bg-red-600 hover:text-white group-hover:opacity-100"
                  aria-label={`Eliminar foto ${index + 1}`}
                  disabled={disabled}
                >
                  <X className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

