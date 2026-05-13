import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';

export function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={UNIVALLE_LOGO_SRC}
        alt={INSTITUTION_NAME}
        className="h-12 w-auto max-w-[160px] shrink-0 object-contain"
      />
      <div>
        <h1 className="text-xl font-bold text-foreground">{APP_NAME}</h1>
        <p className="text-xs text-muted-foreground">{INSTITUTION_NAME}</p>
      </div>
    </div>
  );
}
