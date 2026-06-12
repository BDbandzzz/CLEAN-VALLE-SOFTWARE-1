import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import {
  LANDING_HERO,
  LANDING_SLIDES,
} from '@/modules/landing/constants/landingContent';

const SLIDE_INTERVAL_MS = 5000;

export function LandingHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (LANDING_SLIDES.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % LANDING_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const changeSlide = (direction) => {
    setActiveSlide((current) => {
      const next = current + direction;
      return (next + LANDING_SLIDES.length) % LANDING_SLIDES.length;
    });
  };

  return (
    <section className="relative h-[68svh] min-h-[460px] max-h-[680px] overflow-hidden bg-foreground">
      {LANDING_SLIDES.map((slide, index) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          className={[
            'absolute inset-0 size-full object-cover transition-opacity duration-700',
            index === activeSlide ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
      ))}

      <div className="absolute inset-0 bg-black/48" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-16 pt-10 sm:px-6 sm:pb-20 lg:px-8">
        <div className="max-w-3xl text-white">
          <p className="text-sm font-semibold">{INSTITUTION_NAME}</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {APP_NAME}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/88 sm:text-lg">
            {LANDING_HERO.description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-10 bg-white text-emerald-800 hover:bg-white/90"
            >
              <Link to={LANDING_HERO.primaryAction.href}>
                {LANDING_HERO.primaryAction.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 border-white/45 bg-black/10 text-white hover:bg-white/12 hover:text-white"
            >
              <Link to={LANDING_HERO.secondaryAction.href}>
                <Eye className="size-4" />
                {LANDING_HERO.secondaryAction.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 right-4 flex items-center gap-2 sm:right-6 lg:right-8">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="border-white/40 bg-black/15 text-white hover:bg-white/15 hover:text-white"
          onClick={() => changeSlide(-1)}
          title="Imagen anterior"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex items-center gap-2 px-1" aria-label="Imágenes del campus">
          {LANDING_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={[
                'h-2 rounded-full bg-white transition-[width,opacity] duration-300',
                index === activeSlide ? 'w-6 opacity-100' : 'w-2 opacity-55',
              ].join(' ')}
              onClick={() => setActiveSlide(index)}
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-current={index === activeSlide}
            />
          ))}
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="border-white/40 bg-black/15 text-white hover:bg-white/15 hover:text-white"
          onClick={() => changeSlide(1)}
          title="Imagen siguiente"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
