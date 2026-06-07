import { Power, RotateCcw, Search, Users } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ColorPill } from '@/core/components/ui/color-pill';
import { EmptyState } from '@/core/components/ui/empty-state';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { SelectField } from '@/core/components/ui/select-field';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { useAuth } from '@/core/context/AuthContext';
import { OPERATOR_SPECIALIZATIONS, USER_ROLES } from '@/core/data/cleanvalleSchema';
import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';
import { useManagedUserFilters } from '@/modules/admin/users/hooks/useManagedUserFilters';

const ROLE_COLORS = {
  estudiante: '#2563eb',
  profesor: '#7c3aed',
  gestor: '#d97706',
  operador: '#0f766e',
  admin: '#991b1b',
};

const ROLE_FILTER_OPTIONS = Object.entries(USER_ROLES).map(([id, label]) => ({
  id,
  label,
}));

function getSpecializationLabels(ids = []) {
  return ids
    .map((id) => OPERATOR_SPECIALIZATIONS.find((option) => option.id === id)?.label)
    .filter(Boolean);
}

export function ManagedUsersList() {
  const { user: currentUser } = useAuth();
  const { users, setUserActive } = useUserManagement();
  const {
    search,
    status,
    role,
    counts,
    filteredUsers,
    setSearch,
    setStatus,
    setRole,
  } = useManagedUserFilters(users);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          Usuarios registrados
        </CardTitle>
        <CardDescription>
          Busca cuentas y controla su acceso al sistema.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="space-y-2">
            <Label htmlFor="user-search">Buscar usuarios</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="user-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre, código, correo o documento"
                className="pl-9"
              />
            </div>
          </div>
          <SelectField
            id="user-role-filter"
            label="Filtrar por rol"
            value={role === 'all' ? '' : role}
            options={ROLE_FILTER_OPTIONS}
            placeholder="Todos los roles"
            onChange={(event) => setRole(event.target.value || 'all')}
          />
        </div>

        <div className="flex rounded-xl border border-border bg-muted/40 p-1">
          <SegmentedTabButton
            label="Todos"
            count={counts.all}
            active={status === 'all'}
            onClick={() => setStatus('all')}
          />
          <SegmentedTabButton
            label="Activos"
            count={counts.active}
            active={status === 'active'}
            onClick={() => setStatus('active')}
          />
          <SegmentedTabButton
            label="Inactivos"
            count={counts.inactive}
            active={status === 'inactive'}
            onClick={() => setStatus('inactive')}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'resultado' : 'resultados'}
        </p>

        {!filteredUsers.length && (
          <EmptyState
            title="No encontramos usuarios"
            description="Prueba con otra búsqueda o cambia los filtros."
            icon={<Search className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const isActive = user.active !== false;
            const isCurrentUser = String(user.id) === String(currentUser?.id);
            const specializations = getSpecializationLabels(user.specializationIds);

            return (
              <article
                key={user.id}
                className={`grid gap-4 rounded-lg border border-border bg-background/80 p-4 lg:grid-cols-[1fr_auto] lg:items-center ${
                  isActive ? '' : 'opacity-70'
                }`}
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
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
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

                {isActive ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setUserActive(user.id, false)}
                    disabled={isCurrentUser}
                    title={isCurrentUser ? 'No puedes desactivar tu propia cuenta' : 'Desactivar usuario'}
                  >
                    <Power className="size-4" />
                    Desactivar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUserActive(user.id, true)}
                  >
                    <RotateCcw className="size-4" />
                    Reactivar
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
