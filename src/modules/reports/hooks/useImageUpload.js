/**
 * useImageUpload
 * --------------
 * Hook de subida de imágenes basado en react-dropzone.
 *
 * Devuelve la misma interfaz pública que antes; el resto del formulario
 * no necesita saber que internamente usa una librería.
 *
 * Límites configurables:
 *   MAX_FILES  – número máximo de imágenes por reporte.
 *   MAX_MB     – peso máximo por imagen en megabytes.
 *
 * Para cambiar los límites edita solo estas dos constantes.
 */
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/* ── Límites ─────────────────────────────────────────────────────────────── */

export const MAX_FILES   = 5;
export const MAX_MB      = 10;
export const ACCEPT_TYPES = 'image/jpeg,image/png,image/webp,image/gif';

const MAX_BYTES = MAX_MB * 1024 * 1024;

/* ── Hook ────────────────────────────────────────────────────────────────── */

export function useImageUpload() {
  const [images, setImages]     = useState([]); // [{ file: File, previewUrl: string }]
  const [imgError, setImgError] = useState('');

  /** Genera previews y agrega los archivos aceptados al estado. */
  const onDrop = useCallback((accepted, rejected) => {
    setImgError('');

    // Cuántos slots quedan disponibles antes de procesar este lote
    const slotsLeft = MAX_FILES - images.length;

    // Archivos que pasan todos los filtros de react-dropzone pero exceden el cupo
    const toAdd  = accepted.slice(0, slotsLeft);
    const excess = accepted.slice(slotsLeft);

    const newEntries = toAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    if (newEntries.length) {
      setImages((prev) => [...prev, ...newEntries]);
    }

    // Construye mensajes de error descriptivos para el usuario
    const msgs = [];

    if (excess.length)
      msgs.push(`${excess.length} imagen(es) ignorada(s): se superó el límite de ${MAX_FILES}.`);

    if (rejected.length) {
      const tooLarge = rejected.filter((r) =>
        r.errors.some((e) => e.code === 'file-too-large')
      ).length;
      const wrongType = rejected.filter((r) =>
        r.errors.some((e) => e.code === 'file-invalid-type')
      ).length;

      if (tooLarge)   msgs.push(`${tooLarge} archivo(s) superan los ${MAX_MB} MB.`);
      if (wrongType)  msgs.push(`${wrongType} archivo(s) no son imágenes válidas.`);
    }

    if (msgs.length) setImgError(msgs.join(' '));
  }, [images.length]);

  /** Configuración de react-dropzone. */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxSize: MAX_BYTES,
    multiple: true,
    // No limitamos aquí con maxFiles porque gestionamos el cupo manualmente
    // para poder mostrar mensajes de error personalizados.
    noClick: false,
    noKeyboard: false,
  });

  /**
   * Elimina una imagen por índice y revoca su Object URL para liberar memoria.
   * @param {number} idx
   */
  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
    setImgError('');
  };

  /**
   * Libera todas las Object URLs y limpia el estado.
   * Llamar cuando se hace reset del formulario completo.
   */
  const clearImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setImgError('');
  };

  return {
    /* Estado */
    images,
    imgError,
    isDragging: isDragActive,
    slotsLeft: MAX_FILES - images.length,

    /* Helpers de react-dropzone — se pasan directamente a ImageUploadZone */
    getRootProps,
    getInputProps,

    /* Acciones */
    removeImage,
    clearImages,
  };
}
