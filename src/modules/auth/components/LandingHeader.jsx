/**
 * LandingHeader.jsx – Barra de navegación sticky de la landing.
 *
 * Muestra el logo de la institución y el botón "Iniciar sesión".
 * Se mantiene en la parte superior al hacer scroll (sticky top-0).
 */
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { UNIVALLE_LOGO_SRC, INSTITUTION_NAME } from '@/core/constants/branding';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">

        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src={UNIVALLE_LOGO_SRC}
            alt={INSTITUTION_NAME}
            className="h-9 w-auto max-w-32 object-contain"
          />
        </Link>

        <nav>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline transition-opacity hover:opacity-90"
          >
            <LogIn size={15} />
            Iniciar sesión
          </Link>
        </nav>

      </div>
    </header>
  );
}
