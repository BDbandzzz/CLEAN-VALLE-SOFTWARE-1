/**
 * LandingCTA.jsx – Banner de llamada a la acción (Call To Action) al final del contenido.
 *
 * Sección de fondo verde oscuro que invita al usuario a registrarse o iniciar sesión.
 * Redirige a /login al hacer clic en "Comenzar ahora".
 *
 * Para editar el texto, modificar directamente las cadenas en este componente
 * o moverlas a landingContent.js si se vuelven dinámicas.
 */
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export function LandingCTA() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
      padding: '4rem 1.25rem',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '580px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center',
      }}>
        <Leaf size={32} style={{ color: '#86efac' }} />

        <h2 style={{
          margin: 0,
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
        }}>
          Únete a la gestión ambiental del campus
        </h2>

        <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.70)', lineHeight: 1.65 }}>
          Accede con tus credenciales institucionales y empieza a contribuir al monitoreo
          y sostenibilidad del entorno universitario.
        </p>

        <Link
          to="/login"
          className="cta-btn-primary"
          style={{ background: '#fff', color: '#15803d', boxShadow: '0 4px 20px rgba(0,0,0,0.20)' }}
        >
          Comenzar ahora
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
