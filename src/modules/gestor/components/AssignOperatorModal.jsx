import React from 'react';
import { X, User, Mail, CheckCircle } from 'lucide-react';

export function AssignOperatorModal({ isOpen, onClose, onAssign, reportTitle, operators = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">Asignar Operador</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecciona un operador disponible para resolver el reporte:<br/>
            <span className="font-semibold text-foreground">"{reportTitle}"</span>
          </p>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {operators.map((operator) => (
              <div
                key={operator.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{operator.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {operator.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onAssign(operator)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <CheckCircle className="size-3.5" />
                  Asignar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
