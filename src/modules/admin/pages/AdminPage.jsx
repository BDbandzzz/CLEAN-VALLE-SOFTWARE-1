import { useState } from 'react';
import { Button } from '@/core/components/ui/button';

const AdminPage = () => {
  const [reports] = useState([
    { id: 1, title: 'Basura en Calle 5', status: 'Pendiente', author: 'Juan Pérez', assignedTo: null },
    { id: 2, title: 'Bache en Avenida', status: 'Pendiente', author: 'María García', assignedTo: null },
    { id: 3, title: 'Foco Dañado', status: 'En Proceso', author: 'Carlos López', assignedTo: 'Operador 1' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona reportes y asigna tareas</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-3xl font-bold">127</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600">45</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <p className="text-sm text-gray-600">En Proceso</p>
          <p className="text-3xl font-bold text-blue-600">32</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Completados</p>
          <p className="text-3xl font-bold text-green-600">50</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">Reportes por Asignar</h2>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
              <div className="flex-1">
                <p className="font-semibold">{report.title}</p>
                <p className="text-sm text-gray-600">Por: {report.author}</p>
                <p className="text-xs text-gray-500 mt-1">Asignado: {report.assignedTo || 'Sin asignar'}</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Asignar</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
