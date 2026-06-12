import { Link } from 'react-router-dom';
import { APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import { LANDING_FOOTER, LANDING_FOOTER_LINKS } from '@/modules/landing/constants/landingContent';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-bold text-foreground">{APP_NAME}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {currentYear} {INSTITUTION_NAME}. {LANDING_FOOTER.rightsLabel}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {LANDING_FOOTER_LINKS.map((item) =>
            item.href.startsWith('http') ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-muted-foreground no-underline transition hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className="text-xs font-medium text-muted-foreground no-underline transition hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
