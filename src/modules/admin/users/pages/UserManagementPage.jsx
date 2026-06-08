import { useState } from 'react';
import { Pencil, UserRoundCog } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { CreateUserForm } from '@/modules/admin/users/components/CreateUserForm';
import { ManagedUsersList } from '@/modules/admin/users/components/ManagedUsersList';
import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';

const USER_MANAGEMENT_TABS = {
  create: 'create',
  edit: 'edit',
  list: 'list',
};

function UserEditPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pencil className="size-5 text-primary" />
          Modificar usuario
        </CardTitle>
        <CardDescription>
          Este espacio quedará reservado para editar datos de usuarios existentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmptyState
          title="Edición pendiente"
          description="Primero dejamos separado el flujo. Luego conectamos búsqueda, selección y formulario de edición."
          icon={<Pencil className="mx-auto size-8 text-muted-foreground" />}
        />
      </CardContent>
    </Card>
  );
}

export default function UserManagementPage() {
  const { users } = useUserManagement();
  const [activeTab, setActiveTab] = useState(USER_MANAGEMENT_TABS.create);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<UserRoundCog />}
        title="Gestión de Usuarios"
        description="Registra y consulta los perfiles habilitados en CleanValle."
      />

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <SegmentedTabButton
          label="Crear usuario"
          active={activeTab === USER_MANAGEMENT_TABS.create}
          onClick={() => setActiveTab(USER_MANAGEMENT_TABS.create)}
          className="gap-2"
        />
        <SegmentedTabButton
          label="Modificar usuario"
          active={activeTab === USER_MANAGEMENT_TABS.edit}
          onClick={() => setActiveTab(USER_MANAGEMENT_TABS.edit)}
          className="gap-2"
        />
        <SegmentedTabButton
          label="Usuarios totales"
          count={users.length}
          active={activeTab === USER_MANAGEMENT_TABS.list}
          onClick={() => setActiveTab(USER_MANAGEMENT_TABS.list)}
          className="gap-2"
        />
      </div>

      {activeTab === USER_MANAGEMENT_TABS.create && (
        <CreateUserForm />
      )}

      {activeTab === USER_MANAGEMENT_TABS.edit && (
        <UserEditPlaceholder />
      )}

      {activeTab === USER_MANAGEMENT_TABS.list && (
        <ManagedUsersList />
      )}
    </div>
  );
}
