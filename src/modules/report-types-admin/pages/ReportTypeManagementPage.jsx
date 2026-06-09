import { useState } from 'react';
import { Tags } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { CreateReportTypeForm } from '@/modules/report-types-admin/components/CreateReportTypeForm';
import { EditReportTypeForm } from '@/modules/report-types-admin/components/EditReportTypeForm';
import { ReportTypesList } from '@/modules/report-types-admin/components/ReportTypesList';
import { REPORT_TYPE_TABS } from '@/modules/report-types-admin/constants/reportTypeFormOptions';
import { useReportTypeManagement } from '@/modules/report-types-admin/context/ReportTypeManagementContext';

export default function ReportTypeManagementPage() {
  const { reportTypes } = useReportTypeManagement();
  const [activeTab, setActiveTab] = useState(REPORT_TYPE_TABS.create);
  const [selectedType, setSelectedType] = useState(null);

  const handleEditType = (type) => {
    setSelectedType(type);
    setActiveTab(REPORT_TYPE_TABS.edit);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<Tags />}
        title="Tipos y subtipos de reportes"
        description="Administra categorías, colores y razones específicas."
      />

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <SegmentedTabButton
          label="Crear tipo"
          active={activeTab === REPORT_TYPE_TABS.create}
          onClick={() => setActiveTab(REPORT_TYPE_TABS.create)}
        />
        <SegmentedTabButton
          label="Modificar tipo"
          active={activeTab === REPORT_TYPE_TABS.edit}
          onClick={() => setActiveTab(REPORT_TYPE_TABS.edit)}
        />
        <SegmentedTabButton
          label="Tipos totales"
          count={reportTypes.length}
          active={activeTab === REPORT_TYPE_TABS.list}
          onClick={() => setActiveTab(REPORT_TYPE_TABS.list)}
        />
      </div>

      {activeTab === REPORT_TYPE_TABS.create && <CreateReportTypeForm />}
      {activeTab === REPORT_TYPE_TABS.edit && (
        <EditReportTypeForm key={selectedType?.id ?? 'empty-report-type'} reportType={selectedType} />
      )}
      {activeTab === REPORT_TYPE_TABS.list && <ReportTypesList onEditType={handleEditType} />}
    </div>
  );
}
