import { User, Mail, Save, X, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { ReadOnlyField } from "@/core/components/ui/fields";

/**
 * ProfilePersonalDataCard.jsx – Formulario de datos personales del perfil.
 *
 * Política de edición:
 *   Solo el correo electrónico es editable por el usuario.
 *   El resto (nombre, apellido, DNI, tipo de DNI, género) viene del sistema
 *   institucional y se muestra en modo read-only (bg-muted/50).
 *
 * Props:
 *   formData      {object}    Datos del usuario: firstName, lastName, email, dniUser, typeDni, gender.
 *   message       {object}    { type: 'success'|'error', text: string } para el feedback.
 *   isSaving      {boolean}   Muestra spinner en el botón mientras se guarda.
 *   onEmailChange {Function}  (value: string) => void – solo actualiza el email.
 *   onSave        {Function}  Handler del botón "Guardar cambios".
 *   onReset       {Function}  Handler del botón "Restablecer" (vuelve al estado original).
 */
export function ProfilePersonalDataCard({
  formData,
  message,
  isSaving,
  onEmailChange,
  onSave,
  onReset,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5 text-primary" aria-hidden />
          Datos personales
        </CardTitle>
        <CardDescription>
          Solo el correo electrónico es editable; el resto viene del registro
          institucional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <ReadOnlyField
            id="firstName"
            label="Nombres"
            value={formData.firstName}
          />

          <ReadOnlyField
            id="lastName"
            label="Apellidos"
            value={formData.lastName}
          />

          <ReadOnlyField
            id="dniUser"
            label="Documento"
            value={formData.dniUser}
          />

          <ReadOnlyField
            id="typeDni"
            label="Tipo de documento"
            value={formData.typeDni}
          />
          <ReadOnlyField id="gender" label="Género" value={formData.gender} />
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                className="pl-9"
                type="email"
                value={formData.email}
                onChange={(e) => onEmailChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {message.text ? (
          <div
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="size-4 shrink-0" aria-hidden />
            ) : (
              <AlertCircle className="size-4 shrink-0" aria-hidden />
            )}
            {message.text}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={onSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Guardando…
              </span>
            ) : (
              <>
                <Save className="size-4" aria-hidden />
                Guardar cambios
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <X className="size-4" aria-hidden />
            Restablecer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
