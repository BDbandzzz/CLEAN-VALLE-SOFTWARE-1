import { Link } from 'react-router-dom';
import { Leaf, LogIn, ArrowRight, Shield, BarChart3, Bell } from 'lucide-react';

import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import { LANDING_HERO, LANDING_FEATURE_CARDS } from '@/core/constants/landingContent';
import { Button } from '@/core/components/ui/button';

/* ── Estilos de animación global ───────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .landing-root * { box-sizing: border-box; }

  @keyframes heroFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes orbPulse {
    0%, 100% { transform: scale(1); opacity: 0.55; }
    50%       { transform: scale(1.08); opacity: 0.80; }
  }

  .feature-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 1.1rem;
    padding: 1.6rem 1.5rem;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    cursor: default;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    animation: fadeUp 0.5s ease both;
  }
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.10);
    border-color: #d1fae5;
  }

  .stat-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 0.3rem 0.85rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .hero-logo-card {
    animation: heroFloat 5s ease-in-out infinite;
  }
  .cta-btn-primary {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    color: #fff;
    border: none;
    border-radius: 0.65rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.97rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(22,163,74,0.30);
    text-decoration: none;
  }
  .cta-btn-primary:hover {
    background: linear-gradient(135deg, #15803d 0%, #166534 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(22,163,74,0.38);
  }
  .cta-btn-outline {
    background: transparent;
    color: #374151;
    border: 1.5px solid #d1d5db;
    border-radius: 0.65rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.97rem;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    transition: all 0.2s ease;
    text-decoration: none;
  }
  .cta-btn-outline:hover {
    border-color: #16a34a;
    color: #16a34a;
    background: #f0fdf4;
  }

  .nav-link {
    color: #6b7280;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.18s;
  }
  .nav-link:hover { color: #16a34a; }

  /* Responsive grid */
  @media (min-width: 640px) {
    .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1024px) {
    .features-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .hero-layout { flex-direction: row !important; align-items: center !important; }
  }
`;

/* ── Componente tarjeta de característica ──────────────────────────── */
const FeatureCard = ({ card, index }) => (
  <div
    className="feature-card"
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    {/* Ícono + tag */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '0.75rem',
        background: card.colorLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
      }}>
        {card.icon}
      </div>
      <span className="stat-chip" style={{ background: card.colorLight, color: card.color }}>
        {card.tag}
      </span>
    </div>

    {/* Título */}
    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
      {card.title}
    </h3>

    {/* Descripción */}
    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65 }}>
      {card.body}
    </p>

    {/* Línea inferior decorativa */}
    <div style={{
      marginTop: 'auto',
      height: '3px',
      borderRadius: '999px',
      background: `linear-gradient(90deg, ${card.color}55, transparent)`,
    }} />
  </div>
);

/* ── Chip de estadística ────────────────────────────────────────────── */
const StatBadge = ({ icon: Icon, label, value, color }) => (
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

/* ── Página principal ───────────────────────────────────────────────── */
const LandingPage = () => (
  <div
    className="landing-root"
    style={{
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: '#f8fafc',
      color: '#111827',
    }}
  >
    <style>{STYLES}</style>

    {/* ── HEADER ─────────────────────────────────────────────────────── */}
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
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img
            src={UNIVALLE_LOGO_SRC}
            alt={INSTITUTION_NAME}
            style={{ height: '38px', width: 'auto', maxWidth: '130px', objectFit: 'contain' }}
          />
          <div style={{ display: 'none' }} className="sm-show">
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{INSTITUTION_NAME}</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#6b7280' }}>{APP_NAME}</p>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className="nav-link" style={{ display: 'none' }}>Acceso</Link>
          <Link to="/login" className="cta-btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
            <LogIn size={15} />
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </header>

    <main>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '4rem 1.25rem 3.5rem',
        position: 'relative',
      }}>
        {/* Orb de fondo */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-80px',
          width: '480px', height: '480px',
          background: 'radial-gradient(circle at 50% 50%, rgba(22,163,74,0.12) 0%, transparent 65%)',
          borderRadius: '50%', filter: 'blur(40px)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'orbPulse 6s ease-in-out infinite',
        }} />

        <div
          className="hero-layout"
          style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 1 }}
        >
          {/* Texto hero */}
          <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Badge */}
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

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <Link to="/login" className="cta-btn-primary">
                Entrar a la plataforma
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://www.univalle.edu.co"
                target="_blank"
                rel="noreferrer"
                className="cta-btn-outline"
              >
                Sitio Univalle
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <StatBadge icon={BarChart3} label="Reportes activos" value="120+" color="#16a34a" />
              <StatBadge icon={Shield}   label="Roles de acceso"  value="4"    color="#7c3aed" />
              <StatBadge icon={Bell}     label="Alertas en tiempo real" value="24/7" color="#dc2626" />
            </div>
          </div>

          {/* Card flotante hero */}
          <div style={{ display: 'flex', justifyContent: 'center', flex: '1', position: 'relative' }}>
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
                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>
                  {INSTITUTION_NAME}
                </p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>
                  {APP_NAME}
                </p>
              </div>
              {/* Indicador verde live */}
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
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#15803d' }}>
                  Sistema activo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN DE CARACTERÍSTICAS ──────────────────────────────── */}
      <section style={{
        borderTop: '1px solid #e5e7eb',
        background: '#fff',
        padding: '4.5rem 1.25rem',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Encabezado */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '999px', padding: '0.3rem 0.9rem',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#15803d' }}>
                ✦ Capacidades del sistema
              </span>
            </div>
            <h2 style={{
              margin: '0 0 0.75rem',
              fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
              fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em',
            }}>
              Todo lo que necesitas para gestionar el campus
            </h2>
            <p style={{
              margin: 0,
              maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto',
              fontSize: '1rem', color: '#6b7280', lineHeight: 1.65,
            }}>
              Una plataforma completa orientada a la sostenibilidad, el monitoreo ambiental
              y la transparencia institucional universitaria.
            </p>
          </div>

          {/* Grid de tarjetas */}
          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.25rem',
            }}
          >
            {LANDING_FEATURE_CARDS.map((card, i) => (
              <FeatureCard key={card.title} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER CTA ──────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
        padding: '4rem 1.25rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
          <Leaf size={32} style={{ color: '#86efac' }} />
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
          }}>
            Únete a la gestión ambiental del campus
          </h2>
          <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.70)', lineHeight: 1.65 }}>
            Accede con tus credenciales institucionales y empieza a contribuir al monitoreo
            y sostenibilidad del entorno universitario.
          </p>
          <Link to="/login" className="cta-btn-primary" style={{
            background: '#fff', color: '#15803d',
            boxShadow: '0 4px 20px rgba(0,0,0,0.20)',
          }}>
            Comenzar ahora
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>

    {/* ── FOOTER ──────────────────────────────────────────────────────── */}
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
  </div>
);

export default LandingPage;
