import { Shield } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardBox} from '@/core/components/ui/card';

/**
 * ProfileSummaryCard.jsx – Columna lateral de resumen del perfil.
 *
 * Muestra: DNI del usuario, email de resumen y una nota sobre almacenamiento local.
 * Esta card está pensada para mostrar datos de solo lectura de forma rápida.
 *
 * Props:
 *   dniUser      {string}  Número de documento del usuario.
 *   emailPreview {string}  Correo actual del usuario (puede estar vacío).
 */
export function ProfileSummaryCard({ dniUser, emailPreview, roleName }) {
  return (
    <Card className="h-fit border-primary/15 bg-gradient-to-br from-card to-emerald-50/40 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="size-4 text-primary" aria-hidden />
          Resumen
        </CardTitle>
        <CardDescription>Tu rol y datos clave</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
      <CardBox
      title="DNI"
      value ={dniUser}
      />

      <CardBox
      title="Email"
      value ={emailPreview}
      />
      
      <CardBox
      title="Rol"
      value={roleName || 'Sin rol'}
      />
      </CardContent>
    </Card>
  );
}
