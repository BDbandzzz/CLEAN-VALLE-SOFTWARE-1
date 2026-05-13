import { Lock, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

const PASSWORD_FIELDS = [
  { id: 'currentPassword', label: 'Contraseña actual', key: 'current', field: 'currentPassword' },
  { id: 'newPassword', label: 'Nueva contraseña', key: 'new', field: 'newPassword' },
  { id: 'confirmPassword', label: 'Confirmar nueva', key: 'confirm', field: 'confirmPassword' },
];

/**
 * Bloque de seguridad / cambio de contraseña.
 */
export function ProfileSecurityCard({
  isChangingPassword,
  onOpenChangePassword,
  passwordData,
  showPasswords,
  passwordMessage,
  isChangingPasswordLoading,
  onPasswordFieldChange,
  onTogglePasswordVisibility,
  onSavePassword,
  onCancelPasswordChange,
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5 text-primary" aria-hidden />
            Seguridad
          </CardTitle>
          <CardDescription>Contraseña y acceso a la cuenta.</CardDescription>
        </div>
        {!isChangingPassword ? (
          <Button variant="secondary" size="sm" onClick={onOpenChangePassword}>
            Cambiar contraseña
          </Button>
        ) : null}
      </CardHeader>

      {isChangingPassword ? (
        <CardContent className="space-y-4 border-t border-border pt-6">
          <div className="grid gap-4 sm:grid-cols-1">
            {PASSWORD_FIELDS.map((row) => (
              <div key={row.id} className="space-y-2">
                <Label htmlFor={row.id}>{row.label}</Label>
                <div className="relative">
                  <Input
                    id={row.id}
                    type={showPasswords[row.key] ? 'text' : 'password'}
                    value={passwordData[row.field]}
                    onChange={(e) => onPasswordFieldChange(row.field, e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => onTogglePasswordVisibility(row.key)}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPasswords[row.key] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {passwordMessage.text ? (
            <p
              className={`text-sm ${passwordMessage.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}
            >
              {passwordMessage.text}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={onSavePassword} disabled={isChangingPasswordLoading}>
              {isChangingPasswordLoading ? 'Procesando…' : 'Guardar contraseña'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancelPasswordChange}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
