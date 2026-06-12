import { useState } from 'react';
import { UserRoundCog } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { CreateUserForm } from '@/modules/users-admin/components/CreateUserForm';
import { EditUserForm } from '@/modules/users-admin/components/EditUserForm';
import { ManagedUsersList } from '@/modules/users-admin/components/ManagedUsersList';
import { useUserManagement } from '@/modules/users-admin/context/UserManagementContext';

const USER_MANAGEMENT_TABS = {
  create: 'create',
  edit: 'edit',
  list: 'list',
};

export default function UserManagementPage() {
  const { total } = useUserManagement();
  const [activeTab, setActiveTab] = useState(USER_MANAGEMENT_TABS.create);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setActiveTab(USER_MANAGEMENT_TABS.edit);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<UserRoundCog />}
        title="Gestión de Usuarios"
        description="Registra y consulta los perfiles habilitados en CleanValle."
      />

      <div className="grid grid-cols-3 rounded-xl bg-muted/40 p-1">
        <SegmentedTabButton
          label="Crear usuario"
          mobileLabel="Crear"
          active={activeTab === USER_MANAGEMENT_TABS.create}
          onClick={() => setActiveTab(USER_MANAGEMENT_TABS.create)}
          className="gap-2"
        />
        <SegmentedTabButton
          label="Modificar usuario"
          mobileLabel="Modificar"
          active={activeTab === USER_MANAGEMENT_TABS.edit}
          onClick={() => setActiveTab(USER_MANAGEMENT_TABS.edit)}
          className="gap-2"
        />
        <SegmentedTabButton
          label="Usuarios totales"
          mobileLabel="Usuarios"
          count={total}
          active={activeTab === USER_MANAGEMENT_TABS.list}
          onClick={() => setActiveTab(USER_MANAGEMENT_TABS.list)}
          className="gap-2"
        />
      </div>

      {activeTab === USER_MANAGEMENT_TABS.create && (
        <CreateUserForm />
      )}

      {activeTab === USER_MANAGEMENT_TABS.edit && (
        <EditUserForm key={selectedUser?.id ?? 'empty-user'} user={selectedUser} />
      )}

      {activeTab === USER_MANAGEMENT_TABS.list && (
        <ManagedUsersList onEditUser={handleEditUser} />
      )}
    </div>
  );
}
