/**
 * LandingFooter.jsx – Pie de página de la landing page.
 *
 * Muestra el nombre de la aplicación con ícono de hoja y el copyright dinámico.
 * El año se calcula automáticamente con new Date().getFullYear().
 */
import { Leaf } from 'lucide-react';
import { APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background px-5 py-7 text-center">
      <div className="mb-1 flex items-center justify-center gap-1.5">
        <Leaf size={14} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">{APP_NAME}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} {INSTITUTION_NAME} · Todos los derechos reservados
      </p>
    </footer>
  );
}
