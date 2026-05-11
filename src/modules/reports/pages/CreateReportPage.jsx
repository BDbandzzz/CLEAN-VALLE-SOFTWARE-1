import { useState } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, Trash2, BrushCleaning, Wrench, Hammer, MoreHorizontal } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';

const severityOptions = [
  {
    value: 'alto',
    label: 'Riesgo Alto',
    description: 'Incidente crítico que requiere atención inmediata',
    color: 'bg-red-600 text-white',
    icon: AlertTriangle,
  },
  {
    value: 'medio',
    label: 'Riesgo Medio',
    description: 'Problema serio pero no urgente',
    color: 'bg-amber-500 text-slate-900',
    icon: ShieldCheck,
  },
  {
    value: 'bajo',
    label: 'Riesgo Bajo',
    description: 'Incidente leve sin peligro inmediato',
    color: 'bg-emerald-600 text-white',
    icon: CheckCircle2,
  },
];

const categoryOptions = [
  {
    value: 'basura',
    label: 'Basura',
    icon: Trash2,
    description: 'Desechos y residuos',
  },
  {
    value: 'limpieza',
    label: 'Limpieza',
    icon: BrushCleaning,
    description: 'Limpieza y aseo',
  },
  {
    value: 'mantenimiento',
    label: 'Mantenimiento',
    icon: Wrench,
    description: 'Revisión y conservación',
  },
  {
    value: 'reparacion',
    label: 'Reparación',
    icon: Hammer,
    description: 'Reparaciones y arreglos',
  },
  {
    value: 'otro',
    label: 'Otro',
    icon: MoreHorizontal,
    description: 'Categoría general',
  },
];

const CreateReportPage = () => {
  const [formData, setFormData] = useState({ title: '', description: '', location: '', category: 'basura', severity: 'medio' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeverity = (severity) => {
    setFormData(prev => ({ ...prev, severity }));
  };

  const handleCategory = (category) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reporte creado exitosamente\nGravedad: ${formData.severity.toUpperCase()}\nCategoría: ${formData.category}`);
    setFormData({ title: '', description: '', location: '', category: 'basura', severity: 'medio' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Crear Reporte</h1>
        <p className="text-slate-600">Reporta un problema con su nivel de riesgo para una atención adecuada.</p>
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" placeholder="Ej: Basura acumulada" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>Gravedad del Reporte</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {severityOptions.map((option) => {
                const Icon = option.icon;
                const isActive = formData.severity === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSeverity(option.value)}
                    className={`rounded-3xl border p-4 text-left transition ${option.color} ${isActive ? 'ring-2 ring-offset-2 ring-emerald-500 shadow-lg' : 'border-transparent hover:opacity-90'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-sm opacity-90">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {categoryOptions.map((category) => {
                const Icon = category.icon;
                const isActive = formData.category === category.value;
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategory(category.value)}
                    className={`rounded-3xl border p-4 text-left transition ${isActive ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-400'} `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{category.label}</p>
                        <p className="text-sm text-slate-500">{category.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación *</Label>
            <Input id="location" name="location" placeholder="Dirección específica" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <textarea id="description" name="description" placeholder="Describe el problema..." value={formData.description} onChange={handleChange} rows="6" className="w-full px-3 py-2 border border-input rounded-md bg-background" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 pt-4">
            <Button type="submit" className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700">Enviar Reporte</Button>
            <Button type="button" variant="outline" className="flex-1">Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportPage;
