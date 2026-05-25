/**
 * ImageUploadZone
 * ---------------
 * Zona visual de drag & drop para subida de imágenes.
 * Se integra con react-dropzone a través de getRootProps / getInputProps.
 *
 * Solo se renderiza cuando quedan slots disponibles (slotsLeft > 0).
 * NO gestiona estado propio.
 *
 * Props:
 *   getRootProps {Function}  Props del contenedor drag-drop (de react-dropzone).
 *   getInputProps {Function} Props del input nativo oculto (de react-dropzone).
 *   isDragging   {boolean}   Si hay un drag activo sobre la zona.
 *   slotsLeft    {number}    Slots de imagen disponibles.
 *   maxFiles     {number}    Límite total de archivos (para el hint).
 *   maxMb        {number}    Límite de tamaño en MB (para el hint).
 */
import { ImagePlus } from 'lucide-react';

export function ImageUploadZone({ getRootProps, getInputProps, isDragging, slotsLeft, maxMb }) {
  return (
    <div
      {...getRootProps()}
      id="image-upload-zone"
      className={[
        'flex w-full cursor-pointer flex-col items-center justify-center gap-2',
        'rounded-xl border-2 border-dashed px-4 py-7 transition-all duration-200',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
      ].join(' ')}
    >
      {/* Input nativo oculto manejado por react-dropzone */}
      <input {...getInputProps()} id="image-file-input" />

      {/* Ícono central */}
      <div className={[
        'flex size-11 items-center justify-center rounded-xl border transition-colors duration-200',
        isDragging
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background text-muted-foreground',
      ].join(' ')}>
        <ImagePlus className="size-5" />
      </div>

      {/* Texto instructivo */}
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragging
            ? 'Suelta las imágenes aquí'
            : 'Arrastra imágenes o haz clic para seleccionar'}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          JPG, PNG, WEBP, GIF · Máx. {maxMb} MB por foto
          {' · '}
          {slotsLeft} espacio{slotsLeft !== 1 ? 's' : ''} disponible{slotsLeft !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
