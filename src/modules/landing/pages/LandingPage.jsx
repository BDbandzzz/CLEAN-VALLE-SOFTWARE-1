import { LandingFooter } from '@/modules/landing/components/LandingFooter';
import { LandingHeader } from '@/modules/landing/components/LandingHeader';
import { LandingHero } from '@/modules/landing/components/LandingHero';

const LandingPage = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <LandingHeader />
    <main className="flex-1">
      <LandingHero />
    </main>
    <LandingFooter />
  </div>
);

export default LandingPage;
