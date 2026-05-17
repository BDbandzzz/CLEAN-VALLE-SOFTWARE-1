/**
 * LandingFeatures.jsx – Sección de características de la landing page.
 *
 * Muestra una cuadrícula responsiva de tarjetas (FeatureCard) generadas
 * a partir de LANDING_FEATURE_CARDS (landingContent.js).
 *
 * Para agregar, quitar o editar tarjetas:
 *   → src/core/constants/landingContent.js (LANDING_FEATURE_CARDS)
 */
import { LANDING_FEATURE_CARDS } from '@/core/constants/landingContent';

/**
 * Tarjeta individual de característica.
 * Nota: colorLight y color son valores dinámicos de datos, por eso usan style inline.
 */
function FeatureCard({ card }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 hover:shadow-md">

      {/* Ícono + etiqueta de categoría */}
      <div className="flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ background: card.colorLight }}
        >
          {card.icon}
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: card.colorLight, color: card.color }}
        >
          {card.tag}
        </span>
      </div>

      {/* Título */}
      <h3 className="text-base font-bold text-foreground">{card.title}</h3>

      {/* Descripción */}
      <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>

    </div>
  );
}

export function LandingFeatures() {
  return (
    <section className="border-t border-border bg-card px-5 py-16">
      <div className="mx-auto max-w-5xl">

        {/* Encabezado de la sección */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-1">
            <span className="text-xs font-semibold text-secondary-foreground">
              ✦ Capacidades del sistema
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Todo lo que necesitas para gestionar el campus
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Una plataforma completa orientada a la sostenibilidad, el monitoreo ambiental
            y la transparencia institucional universitaria.
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>

      </div>
    </section>
  );
}
