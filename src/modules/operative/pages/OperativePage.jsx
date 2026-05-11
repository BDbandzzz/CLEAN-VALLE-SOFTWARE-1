import { useState } from 'react';
import { Button } from '@/core/components/ui/button';

const OperativePage = () => {
  const [assignedReports] = useState([
    { id: 1, title: 'Basura en Calle 5', location: 'Calle 5, Zona Centro', status: 'Pendiente', priority: 'Alta' },
    { id: 2, title: 'Bache en Avenida', location: 'Avenida Principal', status: 'En Proceso', priority: 'Media' },
    { id: 3, title: 'Limpieza de Parque', location: 'Parque Central', status: 'Pendiente', priority: 'Media' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'En Proceso': return 'bg-blue-100 text-blue-800';
      case 'Completado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'text-red-600 font-bold';
      case 'Media': return 'text-yellow-600 font-semibold';
      case 'Baja': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Mis Tareas Asignadas</h1>
        <p className="text-muted-foreground">Reportes asignados para resolver</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Total Asignados</p>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <p className="text-sm text-gray-600">En Proceso</p>
          <p className="text-3xl font-bold text-blue-600">1</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600">2</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Título</th>
              <th className="px-6 py-3 text-left font-semibold">Ubicación</th>
              <th className="px-6 py-3 text-left font-semibold">Estado</th>
              <th className="px-6 py-3 text-left font-semibold">Prioridad</th>
              <th className="px-6 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assignedReports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold">{report.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.location}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>{report.status}</span></td>
                <td className={`px-6 py-4 text-sm ${getPriorityColor(report.priority)}`}>{report.priority}</td>
                <td className="px-6 py-4"><Button size="sm" className="bg-green-600 hover:bg-green-700">Hecho</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperativePage;
