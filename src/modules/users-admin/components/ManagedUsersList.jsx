import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ColorPill } from '@/core/components/ui/color-pill';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { EmptyState } from '@/core/components/ui/empty-state';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { SelectField } from '@/core/components/ui/select-field';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { ELEMENT_STATE_IDS, USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { useAuth } from '@/core/context/AuthContext';
import { getRoleDisplayLabel, isRoleId } from '@/core/mappers/domainMappers';
import { useUserManagement } from '@/modules/users-admin/context/UserManagementContext';
import { showSuccessAlert } from '@/core/services/alertService';

const PAGE_SIZE = 10;

export function ManagedUsersList({ onEditUser }) {
  const { user: currentUser } = useAuth();
  const {
    users,
    roles,
    total,
    isLoading,
    isMutating,
    error,
    loadUsers,
    deleteUser,
  } = useUserManagement();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const confirmation = CONFIRMATION_MESSAGES.users.delete;

  const stateId = useMemo(() => {
    return status === 'deleted'
      ? ELEMENT_STATE_IDS.INACTIVE
      : ELEMENT_STATE_IDS.ACTIVE;
  }, [status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadUsers({
        page,
        pageSize: PAGE_SIZE,
        search,
        stateId,
        roleId: role ? Number(role) : null,
      });
    }, search ? 300 : 0);

    return () => window.clearTimeout(timeout);
  }, [loadUsers, page, role, search, stateId]);

  const changeStatus = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const changeRole = (event) => {
    setRole(event.target.value);
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      showSuccessAlert('El usuario fue eliminado.');
      setUserToDelete(null);
    } catch {
      // El contexto muestra el error del servicio.
    }
  };

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
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Nombre, código o documento"
                className="pl-9"
              />
            </div>
          </div>
          <SelectField
            id="user-role-filter"
            label="Filtrar por rol"
            value={role}
            options={roles}
            placeholder="Todos los roles"
            onChange={changeRole}
          />
        </div>

        <div className="flex rounded-xl border border-border bg-muted/40 p-1">
          <SegmentedTabButton
            label="Activos"
            active={status === 'active'}
            onClick={() => changeStatus('active')}
          />
          <SegmentedTabButton
            label="Eliminados"
            active={status === 'deleted'}
            onClick={() => changeStatus('deleted')}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {total} {total === 1 ? 'resultado' : 'resultados'}
        </p>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Cargando usuarios...
          </div>
        )}

        {!isLoading && !users.length && (
          <EmptyState
            title="No encontramos usuarios"
            description="Prueba con otra búsqueda o cambia los filtros."
            icon={<Search className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        {!isLoading && (
          <div className="space-y-3">
            {users.map((user) => {
              const isActive = user.active !== false;
              const isCurrentUser = String(user.id) === String(currentUser?.id);
              const isAdministrator = isRoleId(
                user.roleId,
                USER_ROLE_IDS.ADMIN
              );
              const actionsDisabled =
                !isActive || isAdministrator || isCurrentUser || isMutating;

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
                        label={getRoleDisplayLabel(user.roleId, user.roleName)}
                        color={user.roleColor || '#6b7280'}
                      />
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isActive ? 'Activo' : 'Eliminado'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{user.codeUser}</span>
                      <span>Documento: {user.dniUser}</span>
                    </div>

                    {user.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {user.specializations.map((specialization) => (
                          <span
                            key={specialization.id}
                            className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {specialization.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onEditUser?.(user)}
                        disabled={isAdministrator}
                        title={
                          isAdministrator
                            ? 'Los administradores no pueden modificar otras cuentas administrativas'
                            : 'Modificar usuario'
                        }
                      >
                        <Pencil className="size-4" />
                        Modificar
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setUserToDelete(user)}
                        disabled={actionsDisabled}
                        title={
                          isAdministrator
                            ? 'Los administradores no pueden eliminar otras cuentas administrativas'
                            : isCurrentUser
                              ? 'No puedes eliminar tu propia cuenta'
                              : 'Eliminar usuario'
                        }
                      >
                        <Trash2 className="size-4" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || isLoading}
                aria-label="Página anterior"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages || isLoading}
                aria-label="Página siguiente"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <ConfirmationMessage
        open={Boolean(userToDelete)}
        {...confirmation}
        isLoading={isMutating}
        onAccept={confirmDelete}
        onReject={() => setUserToDelete(null)}
      />
    </Card>
  );
}
