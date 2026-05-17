/**
 * LandingCTA.jsx – Banner de llamada a la acción al final del contenido.
 *
 * Sección de fondo verde oscuro que invita al usuario a iniciar sesión.
 * Redirige a /login al hacer clic en "Comenzar ahora".
 */
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export function LandingCTA() {
  return (
    <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-5 py-16 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5">

        <Leaf size={32} className="text-green-300" />

        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Únete a la gestión ambiental del campus
        </h2>

        <p className="text-base leading-relaxed text-white/70">
          Accede con tus credenciales institucionales y empieza a contribuir al monitoreo
          y sostenibilidad del entorno universitario.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-800 no-underline shadow-md transition-opacity hover:opacity-90"
        >
          Comenzar ahora
          <ArrowRight size={16} />
        </Link>

      </div>
    </section>
  );
}
