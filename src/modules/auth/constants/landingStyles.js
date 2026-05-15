/**
 * landingStyles.js – Estilos globales de animación de la Landing.
 *
 * Se inyectan como <style>{LANDING_STYLES}</style> en LandingPage.
 * Las clases definidas aquí se usan en los componentes de la landing.
 *
 * Clases expuestas:
 *   .feature-card   – Tarjeta de característica con hover lift.
 *   .stat-chip      – Pill de estadística.
 *   .hero-logo-card – Card flotante con animación heroFloat.
 *   .cta-btn-primary / .cta-btn-outline – Botones CTA.
 *   .nav-link       – Enlace del header.
 *   .features-grid  – Grid responsivo (1 → 2 → 3 columnas).
 *   .hero-layout    – Flex layout del hero (col en mobile, row en desktop).
 */
export const LANDING_STYLES = `
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

  .landing-root * { box-sizing: border-box; }

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

  .hero-logo-card { animation: heroFloat 5s ease-in-out infinite; }

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

  @media (min-width: 640px) {
    .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1024px) {
    .features-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .hero-layout { flex-direction: row !important; align-items: center !important; }
  }
`;
