/**
 * LandingFeatures.jsx – Sección de características de la landing page.
 *
 * Muestra una cuadrícula responsiva de tarjetas (FeatureCard) generadas
 * a partir de LANDING_FEATURE_CARDS (landingContent.js).
 *
 * Para agregar, quitar o editar tarjetas:
 *   → src/core/constants/landingContent.js (LANDING_FEATURE_CARDS)
 *
 * La cuadrícula escala automáticamente:
 *   Mobile  → 1 columna
 *   Tablet  → 2 columnas
 *   Desktop → 3 columnas
 */
import { LANDING_FEATURE_CARDS } from '@/core/constants/landingContent';

/**
 * Tarjeta individual de característica.
 *
 * Props:
 *   card  {{ icon, tag, title, body, color, colorLight }}
 *   index {number}  Índice para escalonar la animación fadeUp.
 */
function FeatureCard({ card, index }) {
  return (
    <div className="feature-card" style={{ animationDelay: `${index * 0.08}s` }}>
      {/* Ícono + etiqueta de categoría */}
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

      {/* Título de la característica */}
      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
        {card.title}
      </h3>

      {/* Descripción */}
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65 }}>
        {card.body}
      </p>

      {/* Línea decorativa inferior con el color de la tarjeta */}
      <div style={{
        marginTop: 'auto',
        height: '3px',
        borderRadius: '999px',
        background: `linear-gradient(90deg, ${card.color}55, transparent)`,
      }} />
    </div>
  );
}

export function LandingFeatures() {
  return (
    <section style={{
      borderTop: '1px solid #e5e7eb',
      background: '#fff',
      padding: '4.5rem 1.25rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Encabezado de la sección */}
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
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}
        >
          {LANDING_FEATURE_CARDS.map((card, i) => (
            <FeatureCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
