import { Wrench } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { SpecializationForm } from '@/modules/specializations-admin/components/SpecializationForm';
import { SpecializationsList } from '@/modules/specializations-admin/components/SpecializationsList';
import {
  listActiveCategoryOptions,
  listManagedSpecializations,
} from '@/services/adminSpecializationService';

export default function SpecializationManagementPage() {
  const [specializations, setSpecializations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [nextSpecializations, nextCategories] = await Promise.all([
        listManagedSpecializations(),
        listActiveCategoryOptions(),
      ]);
      setSpecializations(nextSpecializations);
      setCategories(nextCategories);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<Wrench />}
        title="Especializaciones de operadores"
        description="Crea capacidades por categoría y déjalas disponibles para asignación."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <SpecializationForm
          key={selectedSpecialization?.id ?? 'create-specialization'}
          specialization={selectedSpecialization}
          categories={categories}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          onSaved={async () => {
            setSelectedSpecialization(null);
            await loadData();
          }}
        />
        <SpecializationsList
          specializations={specializations}
          categories={categories}
          isLoading={isLoading}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          error={error}
          onEdit={setSelectedSpecialization}
          onChanged={loadData}
        />
      </div>
    </div>
  );
}
