import { MapPinned } from 'lucide-react';
import { useState } from 'react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { LocationForm } from '@/modules/locations-admin/components/LocationForm';
import { LocationsList } from '@/modules/locations-admin/components/LocationsList';
import { useLocationManagement } from '@/modules/locations-admin/context/LocationManagementContext';

export default function LocationManagementPage() {
  const { locations } = useLocationManagement();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const editLocation = (location) => {
    setSelectedLocation(location);
    setActiveTab('edit');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<MapPinned />}
        title="Gestión de localizaciones"
        description="Administra lugares y ubicaciones específicas disponibles en los reportes."
      />

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <SegmentedTabButton
          label="Crear localización"
          active={activeTab === 'create'}
          onClick={() => {
            setSelectedLocation(null);
            setActiveTab('create');
          }}
        />
        <SegmentedTabButton
          label="Modificar"
          active={activeTab === 'edit'}
          onClick={() => setActiveTab('edit')}
        />
        <SegmentedTabButton
          label="Localizaciones"
          count={locations.length}
          active={activeTab === 'list'}
          onClick={() => setActiveTab('list')}
        />
      </div>

      {activeTab === 'create' && <LocationForm key="create-location" />}
      {activeTab === 'edit' && (
        selectedLocation ? (
          <LocationForm
            key={selectedLocation.id}
            location={selectedLocation}
            onSaved={() => setActiveTab('list')}
          />
        ) : (
          <LocationsList onEdit={editLocation} />
        )
      )}
      {activeTab === 'list' && <LocationsList onEdit={editLocation} />}
    </div>
  );
}
