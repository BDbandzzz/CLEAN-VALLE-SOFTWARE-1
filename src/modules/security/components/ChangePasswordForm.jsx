import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

import { useAuth } from '@/core/context/AuthContext';
import { changePasswordAfterLogin } from '@/modules/security/utils/changePasswordService';

const PASSWORD_FIELDS = [
  { id: 'cp-current',  field: 'currentPassword', label: 'Contraseña actual',     key: 'current' },
  { id: 'cp-new',      field: 'newPassword',      label: 'Nueva contraseña',       key: 'new'     },
  { id: 'cp-confirm',  field: 'confirmPassword',  label: 'Confirmar contraseña',   key: 'confirm' },
];

const INITIAL_DATA = { currentPassword: '', newPassword: '', confirmPassword: '' };
const INITIAL_SHOW = { current: false, new: false, confirm: false };

function validate(data) {
  if (!data.currentPassword) return 'Ingresa tu contraseña actual.';
  if (data.newPassword.length < 8) return 'La nueva contraseña debe tener al menos 8 caracteres.';
  if (data.newPassword === data.currentPassword)
    return 'La nueva contraseña no puede ser igual a la actual.';
  if (data.newPassword !== data.confirmPassword) return 'Las contraseñas no coinciden.';
  return null;
}

/**
 * Formulario de cambio de contraseña, desacoplado de ProfilePage.
 * Reutilizable desde el sidebar.
 */
export function ChangePasswordForm({ onSuccess }) {
  const { user } = useAuth();
  const [data, setData] = useState(INITIAL_DATA);
  const [show, setShow] = useState(INITIAL_SHOW);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate(data);
    if (msg) { setError(msg); return; }

    setIsLoading(true);
    try {
      const codeUser = user?.id;

      if (!codeUser) {
        setError('No se pudo identificar el usuario autenticado.');
        return;
      }

      await changePasswordAfterLogin(codeUser, data);
      setDone(true);
      setData(INITIAL_DATA);
      onSuccess?.();
    } catch {
      setError('No se pudo actualizar la contraseÃ±a. Revisa la contraseÃ±a actual.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setShow(INITIAL_SHOW);
    setError('');
    setDone(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" id="change-password-form">
      {done && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            ¡Contraseña actualizada exitosamente!
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {PASSWORD_FIELDS.map((row) => (
        <div key={row.id} className="space-y-1.5">
          <label htmlFor={row.id} className="block text-sm font-medium text-foreground">
            {row.label}
          </label>
          <div className="relative">
            <input
              id={row.id}
              type={show[row.key] ? 'text' : 'password'}
              value={data[row.field]}
              onChange={(e) => set(row.field, e.target.value)}
              autoComplete="off"
              className="
                w-full rounded-lg border border-input bg-background px-3.5 py-2.5 pr-10
                text-sm placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring transition
              "
              placeholder={row.label}
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, [row.key]: !prev[row.key] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              aria-label={show[row.key] ? 'Ocultar' : 'Mostrar'}
            >
              {show[row.key] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      ))}

      {/* Indicador visual de requisitos */}
      {data.newPassword.length > 0 && (
        <ul className="space-y-1">
          <Req met={data.newPassword.length >= 8} label="Mínimo 8 caracteres" />
          <Req met={data.newPassword !== data.currentPassword && data.currentPassword.length > 0} label="Diferente a la actual" />
          <Req met={data.newPassword === data.confirmPassword && data.confirmPassword.length > 0} label="Las contraseñas coinciden" />
        </ul>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          id="save-password-btn"
          disabled={isLoading}
          className="
            inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5
            text-sm font-semibold text-primary-foreground shadow-sm transition
            hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        >
          <Lock className="size-4" />
          {isLoading ? 'Guardando…' : 'Actualizar contraseña'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="
            inline-flex items-center gap-2 rounded-lg border border-border bg-background
            px-5 py-2.5 text-sm font-medium text-muted-foreground transition
            hover:bg-muted hover:text-foreground disabled:opacity-50
          "
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Req({ met, label }) {
  return (
    <li className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      <CheckCircle2 className={`size-3.5 ${met ? 'opacity-100' : 'opacity-30'}`} />
      {label}
    </li>
  );
}
