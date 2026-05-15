/**
 * LandingHeader.jsx – Barra de navegación sticky de la landing.
 *
 * Muestra el logo de la institución y el botón "Iniciar sesión".
 * Se mantiene en la parte superior al hacer scroll (position: sticky).
 * Aplica efecto glassmorphism con backdrop-filter blur.
 */
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';

export function LandingHeader() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid #e5e7eb',
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 1.25rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        {/* Logo + nombre de la institución */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img
            src={UNIVALLE_LOGO_SRC}
            alt={INSTITUTION_NAME}
            style={{ height: '38px', width: 'auto', maxWidth: '130px', objectFit: 'contain' }}
          />
          <div style={{ display: 'none' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{INSTITUTION_NAME}</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#6b7280' }}>{APP_NAME}</p>
          </div>
        </Link>

        {/* Navegación */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className="cta-btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
            <LogIn size={15} />
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </header>
  );
}
