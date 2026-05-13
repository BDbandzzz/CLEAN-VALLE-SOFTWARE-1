import { Link } from 'react-router-dom';
import { Leaf, LogIn } from 'lucide-react';

import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import { LANDING_HERO, LANDING_FEATURE_CARDS } from '@/core/constants/landingContent';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-background to-background">
      <header className="sticky top-0 z-50 border-b border-emerald-200/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img
              src={UNIVALLE_LOGO_SRC}
              alt={INSTITUTION_NAME}
              className="h-10 w-auto max-w-[140px] shrink-0 object-contain"
            />
            <div className="min-w-0 hidden sm:block">
              <p className="truncate text-sm font-semibold text-foreground">{INSTITUTION_NAME}</p>
              <p className="truncate text-xs text-muted-foreground">{APP_NAME}</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:inline"
            >
              Acceso
            </Link>
            <Button asChild size="default" className="gap-2">
              <Link to="/login">
                <LogIn className="size-4" />
                Iniciar sesión
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Leaf className="size-3.5" />
                Plataforma institucional
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{LANDING_HERO.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{LANDING_HERO.subtitle}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg">
                  <Link to="/login">Entrar a la plataforma</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.univalle.edu.co" target="_blank" rel="noreferrer">
                    Sitio Univalle
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 to-emerald-300/30 blur-2xl" />
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <img
                  src={UNIVALLE_LOGO_SRC}
                  alt={INSTITUTION_NAME}
                  className="mx-auto h-24 w-auto max-w-[220px] object-contain"
                />
                <p className="mt-4 text-center text-sm font-medium text-foreground">{INSTITUTION_NAME}</p>
                <p className="text-center text-xs text-muted-foreground">{APP_NAME}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl">En qué estamos</h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
              Contenido de ejemplo — sustituye los textos en <code className="rounded bg-muted px-1 text-xs">landingContent.js</code>.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {LANDING_FEATURE_CARDS.map((card) => (
                <Card key={card.title} className="border-emerald-200/50 shadow-md transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">Vista previa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {INSTITUTION_NAME} · {APP_NAME}
      </footer>
    </div>
  );
};

export default LandingPage;
