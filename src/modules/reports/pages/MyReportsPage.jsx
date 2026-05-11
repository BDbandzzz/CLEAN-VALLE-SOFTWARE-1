import { useState } from 'react';

const MyReportsPage = () => {
  const [myReports] = useState([
    { id: 1, title: 'Basura en Calle 5', status: 'Pendiente', date: '2026-05-08', priority: 'Alta' },
    { id: 2, title: 'Bache', status: 'En Proceso', date: '2026-05-07', priority: 'Media' },
    { id: 3, title: 'Alumbrado', status: 'Completado', date: '2026-05-06', priority: 'Media' },
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
        <h1 className="text-4xl font-bold mb-2">Reportes Asignados</h1>
        <p className="text-muted-foreground">Tus reportes y su estado</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Título</th>
              <th className="px-6 py-3 text-left font-semibold">Estado</th>
              <th className="px-6 py-3 text-left font-semibold">Prioridad</th>
              <th className="px-6 py-3 text-left font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {myReports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4">{report.title}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>{report.status}</span></td>
                <td className={`px-6 py-4 text-sm ${getPriorityColor(report.priority)}`}>{report.priority}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReportsPage;
