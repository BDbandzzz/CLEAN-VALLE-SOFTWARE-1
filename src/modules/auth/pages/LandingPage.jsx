/**
 * LandingPage.jsx – Página de inicio pública de CleanValle.
 *
 * Orquestador: compone las secciones de la landing en orden visual.
 * NO contiene lógica ni estilos propios.
 *
 * Secciones (en orden):
 *   LandingHeader   → Navbar sticky con logo y botón de login.
 *   LandingHero     → Hero con título, CTAs, stats y card con logo.
 *   LandingFeatures → Grilla de tarjetas de características.
 *   LandingCTA      → Banner de llamada a la acción.
 *   LandingFooter   → Pie de página con copyright.
 *
 * Textos editables:
 *   → src/core/constants/landingContent.js
 *   → src/core/constants/branding.js
 */
import { LandingHeader }   from '../components/LandingHeader';
import { LandingHero }     from '../components/LandingHero';
import { LandingFeatures } from '../components/LandingFeatures';
import { LandingCTA }      from '../components/LandingCTA';
import { LandingFooter }   from '../components/LandingFooter';

const LandingPage = () => (
  <div className="min-h-screen bg-background text-foreground">
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
