/**
 * LandingPage.jsx – Página de inicio pública de CleanValle.
 *
 * Orquestador: compone las secciones de la landing en orden visual.
 * NO contiene lógica ni estilos propios.
 *
 * Secciones (en orden):
 *   LandingHeader   → Navbar sticky con logo y botón de login.
 *   LandingHero     → Hero con título, CTAs, stats y card flotante.
 *   LandingFeatures → Grilla de tarjetas de características.
 *   LandingCTA      → Banner verde de llamada a la acción.
 *   LandingFooter   → Pie de página con copyright.
 *
 * Textos editables:
 *   → src/core/constants/landingContent.js  (título, subtítulo, tarjetas)
 *   → src/core/constants/branding.js        (nombre app, institución, logo)
 *
 * Estilos de animación:
 *   → src/modules/auth/constants/landingStyles.js
 */
import { LANDING_STYLES }  from '../constants/landingStyles';
import { LandingHeader }   from '../components/LandingHeader';
import { LandingHero }     from '../components/LandingHero';
import { LandingFeatures } from '../components/LandingFeatures';
import { LandingCTA }      from '../components/LandingCTA';
import { LandingFooter }   from '../components/LandingFooter';

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
    {/* Estilos de animación global de la landing */}
    <style>{LANDING_STYLES}</style>

    <LandingHeader />

    <main>
      <LandingHero />
      <LandingFeatures />
      <LandingCTA />
    </main>

    <LandingFooter />
  </div>
);

export default LandingPage;
