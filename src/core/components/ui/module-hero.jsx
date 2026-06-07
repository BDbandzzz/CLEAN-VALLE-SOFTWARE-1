import { cn } from '@/core/lib/utils';

const SIZE_STYLES = {
  compact: {
    section: 'p-6',
    layout: 'gap-4 sm:flex-row sm:items-center sm:justify-between',
    lead: 'gap-4',
    icon: 'size-12 rounded-xl [&_svg]:size-5',
    title: 'text-2xl',
    description: 'mt-1',
  },
  default: {
    section: 'p-8',
    layout: 'gap-5 sm:flex-row sm:items-center sm:justify-between',
    lead: 'gap-4',
    icon: 'size-14 rounded-xl [&_svg]:size-7',
    title: 'text-2xl sm:text-3xl',
    description: 'mt-1',
  },
  large: {
    section: 'p-8 sm:p-10',
    layout: 'gap-8 md:flex-row md:items-end md:justify-between',
    lead: 'flex-col items-center gap-5 sm:flex-row sm:items-center',
    icon: 'size-24 rounded-2xl text-3xl [&_svg]:size-10',
    title: 'text-3xl sm:text-4xl',
    description: 'mt-2 max-w-md',
  },
};

const VARIANT_STYLES = {
  gradient: {
    section: 'border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 text-primary-foreground shadow-xl',
    icon: 'border-2 border-white/30 bg-white/15 shadow-inner backdrop-blur-sm',
    description: 'text-primary-foreground/80',
  },
  surface: {
    section: 'border-border bg-card text-foreground shadow-sm',
    icon: 'bg-primary text-primary-foreground',
    description: 'text-muted-foreground',
  },
};

export function ModuleHero({
  title,
  description = '',
  icon = null,
  visual = null,
  aside = null,
  actions = null,
  size = 'default',
  variant = 'gradient',
  className = '',
  contentClassName = '',
}) {
  const sizeStyles = SIZE_STYLES[size] ?? SIZE_STYLES.default;
  const variantStyles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.gradient;
  const hasEndContent = Boolean(aside || actions);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border',
        sizeStyles.section,
        variantStyles.section,
        className
      )}
    >
      <div className={cn('relative flex flex-col', sizeStyles.layout, contentClassName)}>
        <div className={cn('flex min-w-0', sizeStyles.lead)}>
          {visual}
          {!visual && icon && (
            <div
              className={cn(
                'flex shrink-0 items-center justify-center font-bold',
                sizeStyles.icon,
                variantStyles.icon
              )}
            >
              {icon}
            </div>
          )}

          <div className={cn('min-w-0', size === 'large' && 'text-center sm:text-left')}>
            <h1 className={cn('font-bold tracking-tight', sizeStyles.title)}>{title}</h1>
            {description && (
              <p className={cn('text-sm', sizeStyles.description, variantStyles.description)}>
                {description}
              </p>
            )}
          </div>
        </div>

        {hasEndContent && (
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {aside}
            {actions && <div className="flex flex-wrap justify-center gap-2 md:justify-end">{actions}</div>}
          </div>
        )}
      </div>
    </section>
  );
}
