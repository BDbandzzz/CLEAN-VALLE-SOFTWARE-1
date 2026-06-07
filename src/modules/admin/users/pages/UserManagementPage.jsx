import { UserRoundCog } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { CreateUserForm } from '@/modules/admin/users/components/CreateUserForm';
import { ManagedUsersList } from '@/modules/admin/users/components/ManagedUsersList';

export default function UserManagementPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<UserRoundCog />}
        title="Gestión de Usuarios"
        description="Registra y consulta los perfiles habilitados en CleanValle."
      />

      <div className="space-y-6">
        <CreateUserForm />
        <ManagedUsersList />
      </div>
    </div>
  );
}
