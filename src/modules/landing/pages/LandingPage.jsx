import { LandingCTA } from '@/modules/landing/components/LandingCTA';
import { LandingFeatures } from '@/modules/landing/components/LandingFeatures';
import { LandingFlow } from '@/modules/landing/components/LandingFlow';
import { LandingFooter } from '@/modules/landing/components/LandingFooter';
import { LandingHeader } from '@/modules/landing/components/LandingHeader';
import { LandingHero } from '@/modules/landing/components/LandingHero';

const LandingPage = () => (
  <div className="min-h-screen bg-muted/30 text-foreground">
    <LandingHeader />
    <main>
      <LandingHero />
      <LandingFeatures />
      <LandingFlow />
      <LandingCTA />
    </main>
    <LandingFooter />
  </div>
);

export default LandingPage;
