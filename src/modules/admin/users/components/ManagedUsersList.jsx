import { Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ColorPill } from '@/core/components/ui/color-pill';
import { EmptyState } from '@/core/components/ui/empty-state';
import { OPERATOR_SPECIALIZATIONS, USER_ROLES } from '@/core/data/cleanvalleSchema';

const ROLE_COLORS = {
  estudiante: '#2563eb',
  profesor: '#7c3aed',
  gestor: '#d97706',
  operador: '#0f766e',
  admin: '#991b1b',
};

function getSpecializationLabels(ids = []) {
  return ids
    .map((id) => OPERATOR_SPECIALIZATIONS.find((option) => option.id === id)?.label)
    .filter(Boolean);
}

export function ManagedUsersList({ users }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          Usuarios registrados
        </CardTitle>
        <CardDescription>
          Cuentas disponibles actualmente en el sistema.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {!users.length && (
          <EmptyState
            title="No hay usuarios registrados"
            description="Los usuarios creados aparecerán en este listado."
            icon={<Users className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        {users.map((user) => {
          const specializations = getSpecializationLabels(user.specializationIds);

          return (
            <article
              key={user.id}
              className="grid gap-4 rounded-lg border border-border bg-background/80 p-4 lg:grid-cols-[1fr_auto] lg:items-center"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </h3>
                  <ColorPill
                    label={USER_ROLES[user.role] ?? user.role}
                    color={ROLE_COLORS[user.role] ?? '#6b7280'}
                  />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{user.codeUser}</span>
                  <span>{user.email}</span>
                  <span>Documento: {user.dniUser}</span>
                </div>
                {specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {specializations.map((specialization) => (
                      <span
                        key={specialization}
                        className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {specialization}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Activo
              </span>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
