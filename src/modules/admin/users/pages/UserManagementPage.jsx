import { UserRoundCog } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { CreateUserForm } from '@/modules/admin/users/components/CreateUserForm';
import { ManagedUsersList } from '@/modules/admin/users/components/ManagedUsersList';
import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';

export default function UserManagementPage() {
  const { users } = useUserManagement();

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<UserRoundCog />}
        title="Gestión de Usuarios"
        description="Registra y consulta los perfiles habilitados en CleanValle."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CreateUserForm />
        <ManagedUsersList users={users} />
      </div>
    </div>
  );
}
