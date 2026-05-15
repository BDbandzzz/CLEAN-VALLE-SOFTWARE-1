/**
 * LandingHero.jsx – Sección principal (hero) de la landing page.
 *
 * Muestra:
 *   - Badge institucional.
 *   - Título y subtítulo desde landingContent.js.
 *   - Botones CTA: "Entrar a la plataforma" y "Sitio Univalle".
 *   - Chips de estadísticas (StatBadge).
 *   - Card flotante con animación heroFloat y logo de la institución.
 *   - Orb de fondo con animación orbPulse.
 *
 * Para editar los textos: src/core/constants/landingContent.js (LANDING_HERO).
 * Para editar los stats: modificar el arreglo STATS en este archivo.
 */
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Shield, BarChart3, Bell } from 'lucide-react';
import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import { LANDING_HERO } from '@/core/constants/landingContent';

/** Estadísticas visibles bajo los CTAs. Para modificarlas edita este arreglo. */
const STATS = [
  { icon: BarChart3, label: 'Reportes activos',       value: '120+', color: '#16a34a' },
  { icon: Shield,    label: 'Roles de acceso',         value: '4',    color: '#7c3aed' },
  { icon: Bell,      label: 'Alertas en tiempo real',  value: '24/7', color: '#dc2626' },
];

/** Chip numérico de estadística: ícono + valor + etiqueta. */
function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '1rem 1.25rem',
      borderRadius: '0.85rem',
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      minWidth: '90px',
    }}>
      <Icon size={18} style={{ color, marginBottom: '0.3rem' }} />
      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>{value}</span>
      <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '1px', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

/** Card flotante con el logo de la institución y el indicador "Sistema activo". */
function HeroLogoCard() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flex: '1', position: 'relative' }}>
      {/* Glow de fondo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(22,163,74,0.18) 0%, transparent 65%)',
        filter: 'blur(30px)', borderRadius: '50%', zIndex: 0,
      }} />
      <div
        className="hero-logo-card"
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '1.4rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(22,163,74,0.10)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          maxWidth: '260px', width: '100%',
          position: 'relative', zIndex: 1,
        }}
      >
        <img
          src={UNIVALLE_LOGO_SRC}
          alt={INSTITUTION_NAME}
          style={{ height: '80px', width: 'auto', maxWidth: '200px', objectFit: 'contain' }}
        />
        <div style={{ width: '100%', height: '1px', background: '#f0fdf4' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>{INSTITUTION_NAME}</p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>{APP_NAME}</p>
        </div>
        {/* Indicador de sistema activo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: '#f0fdf4', borderRadius: '999px',
          padding: '0.3rem 0.75rem',
          border: '1px solid #bbf7d0',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#16a34a',
            boxShadow: '0 0 0 3px rgba(22,163,74,0.25)',
            display: 'inline-block',
          }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#15803d' }}>Sistema activo</span>
        </div>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section style={{
      maxWidth: '1100px', margin: '0 auto',
      padding: '4rem 1.25rem 3.5rem',
      position: 'relative',
    }}>
      {/* Orb de fondo decorativo */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-80px',
        width: '480px', height: '480px',
        background: 'radial-gradient(circle at 50% 50%, rgba(22,163,74,0.12) 0%, transparent 65%)',
        borderRadius: '50%', filter: 'blur(40px)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'orbPulse 6s ease-in-out infinite',
      }} />

      <div className="hero-layout" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 1 }}>

        {/* Columna de texto */}
        <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Badge institucional */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            borderRadius: '999px',
            background: '#dcfce7', border: '1px solid #bbf7d0',
            padding: '0.3rem 0.9rem',
            width: 'fit-content',
          }}>
            <Leaf size={13} style={{ color: '#16a34a' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#15803d' }}>
              Plataforma institucional · Univalle
            </span>
          </div>

          {/* Título */}
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800, lineHeight: 1.15,
            color: '#0f172a', letterSpacing: '-0.03em',
          }}>
            {LANDING_HERO.title}
          </h1>

          {/* Subtítulo */}
          <p style={{ margin: 0, fontSize: '1.05rem', color: '#6b7280', lineHeight: 1.7 }}>
            {LANDING_HERO.subtitle}
          </p>

          {/* Botones CTA */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <Link to="/login" className="cta-btn-primary">
              Entrar a la plataforma
              <ArrowRight size={16} />
            </Link>
            <a href="https://www.univalle.edu.co" target="_blank" rel="noreferrer" className="cta-btn-outline">
              Sitio Univalle
            </a>
          </div>

          {/* Chips de estadísticas */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
            {STATS.map((s) => (
              <StatBadge key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Card flotante */}
        <HeroLogoCard />
      </div>
    </section>
  );
}
