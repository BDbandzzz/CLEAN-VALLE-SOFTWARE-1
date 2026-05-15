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
    <footer style={{
      borderTop: '1px solid #e5e7eb',
      background: '#fff',
      padding: '1.75rem 1.25rem',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '0.4rem' }}>
        <Leaf size={14} style={{ color: '#16a34a' }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{APP_NAME}</span>
      </div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
        © {new Date().getFullYear()} {INSTITUTION_NAME} · Todos los derechos reservados
      </p>
    </footer>
  );
}
