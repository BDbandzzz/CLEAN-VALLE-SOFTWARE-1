import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { APP_NAME, INSTITUTION_NAME, UNIVALLE_LOGO_SRC } from '@/core/constants/branding';
import { LANDING_HEADER, LANDING_NAV_LINKS } from '@/modules/landing/constants/landingContent';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 no-underline">
          <img
            src={UNIVALLE_LOGO_SRC}
            alt={INSTITUTION_NAME}
            className="h-8 w-auto max-w-[120px] shrink-0 object-contain sm:h-9 sm:max-w-[150px]"
          />
          <div className="hidden min-w-0 border-l border-border pl-3 sm:block">
            <p className="text-sm font-bold leading-tight text-foreground">{APP_NAME}</p>
            <p className="text-xs leading-tight text-muted-foreground">{INSTITUTION_NAME}</p>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {LANDING_NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground no-underline transition hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button asChild className="ml-auto h-9 gap-2 px-3 md:ml-2">
          <Link to="/login">
            <LogIn className="size-4" />
            <span className="hidden sm:inline">{LANDING_HEADER.loginLabel}</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
