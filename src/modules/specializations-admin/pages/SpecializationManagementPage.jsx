import { Wrench } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { SpecializationForm } from '@/modules/specializations-admin/components/SpecializationForm';
import { SpecializationsList } from '@/modules/specializations-admin/components/SpecializationsList';
import {
  listActiveCategoryOptions,
  listManagedSpecializations,
} from '@/services/adminSpecializationService';

const SPECIALIZATION_VIEWS = {
  list: 'list',
  create: 'create',
  edit: 'edit',
};

export default function SpecializationManagementPage() {
  const [specializations, setSpecializations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [activeView, setActiveView] = useState(SPECIALIZATION_VIEWS.list);
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

  const showList = () => {
    setSelectedSpecialization(null);
    setActiveView(SPECIALIZATION_VIEWS.list);
  };

  const editSpecialization = (specialization) => {
    setSelectedSpecialization(specialization);
    setActiveView(SPECIALIZATION_VIEWS.edit);
    window.setTimeout(() => {
      document
        .getElementById('specialization-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<Wrench />}
        title="Especializaciones de operadores"
        description="Crea capacidades por categoría y déjalas disponibles para asignación."
      />

      <div
        className={`grid rounded-xl bg-muted/40 p-1 ${
          activeView === SPECIALIZATION_VIEWS.edit
            ? 'grid-cols-3'
            : 'grid-cols-2'
        }`}
      >
        <SegmentedTabButton
          label="Especializaciones registradas"
          mobileLabel="Registradas"
          count={specializations.length}
          active={activeView === SPECIALIZATION_VIEWS.list}
          onClick={showList}
        />
        <SegmentedTabButton
          label="Crear especialización"
          mobileLabel="Crear"
          active={activeView === SPECIALIZATION_VIEWS.create}
          onClick={() => {
            setSelectedSpecialization(null);
            setActiveView(SPECIALIZATION_VIEWS.create);
          }}
        />
        {activeView === SPECIALIZATION_VIEWS.edit && (
          <SegmentedTabButton
            label="Modificar especialización"
            mobileLabel="Modificar"
            active
            onClick={() => {}}
          />
        )}
      </div>

      {activeView !== SPECIALIZATION_VIEWS.list && (
        <div id="specialization-form" className="scroll-mt-4">
          <SpecializationForm
            key={selectedSpecialization?.id ?? 'create-specialization'}
            specialization={selectedSpecialization}
            categories={categories}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            onSaved={async () => {
              await loadData();
              showList();
            }}
            onCancel={showList}
          />
        </div>
      )}

      {activeView === SPECIALIZATION_VIEWS.list && (
        <SpecializationsList
          specializations={specializations}
          categories={categories}
          isLoading={isLoading}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          error={error}
          onEdit={editSpecialization}
          onChanged={loadData}
        />
      )}
    </div>
  );
}
