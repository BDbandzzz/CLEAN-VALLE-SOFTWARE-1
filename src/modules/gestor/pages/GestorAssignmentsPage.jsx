import React, { useState } from 'react';
import { useReports } from '@/modules/reports/context/ReportsContext';
import { ReportCard } from '@/modules/reports/components/ReportCard';
import { AssignOperatorModal } from '../components/AssignOperatorModal';
import { ClipboardList, Trash2, UserPlus } from 'lucide-react';
import { API_BASE_URL } from '@/core/constants/api';

import { useAuth } from '@/core/context/AuthContext';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function mapOperator(user) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return {
    ...user,
    id: pickFirst(user.codeUser, user.id, user.operatorId),
    name: pickFirst(user.name, fullName, user.fullName, 'Operador'),
    email: pickFirst(user.email, ''),
  };
}

const GestorAssignmentsPage = () => {
  const { user } = useAuth();
  const { reports, assignReport, discardReport } = useReports();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operators, setOperators] = useState([]);

  // Solo mostrar reportes pendientes de asignacion.
  const pendingReports = reports.filter(r => r.statusKey === 'submitted');

  // Fetch operators when modal opens
  const handleOpenModal = async (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/users?role=operador`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOperators(Array.isArray(data) ? data.map(mapOperator) : []);
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const handleAssign = (operator) => {
    if (selectedReport) {
      assignReport(selectedReport.id, operator, user.id);
      setIsModalOpen(false);
      setSelectedReport(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Asignación de Reporte</h1>
        <p className="text-muted-foreground mt-2">
          Asigna los reportes pendientes a los operadores disponibles o descártalos si no cumplen con los criterios.
        </p>
      </div>
      
      <div className="space-y-6">
        {pendingReports.length > 0 ? (
          pendingReports.map(report => (
            <div key={report.id} className="relative group">
              <ReportCard report={report} />
              
              {/* Controles de acción superpuestos (o debajo en móvil) */}
              <div className="mt-3 flex items-center justify-end gap-3 sm:absolute sm:bottom-5 sm:right-5 sm:mt-0">
                <button
                  onClick={() => discardReport(report.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="size-4" />
                  Descartar
                </button>
                <button
                  onClick={() => handleOpenModal(report)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 shadow-sm"
                >
                  <UserPlus className="size-4" />
                  Asignar Operador
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center bg-card shadow-sm">
            <div className="rounded-full bg-muted p-3 mb-3">
              <ClipboardList className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No hay reportes pendientes</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Todos los reportes han sido asignados o procesados.
            </p>
          </div>
        )}
      </div>

      <AssignOperatorModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAssign={handleAssign}
        reportTitle={selectedReport?.title}
        operators={operators}
      />
    </div>
  );
};

export default GestorAssignmentsPage;
