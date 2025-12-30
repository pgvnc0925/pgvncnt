import React from 'react';

interface StepCardProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * STEP CARD (PV UX CANON)
 * Contenitore per una sezione di input
 * Mostra progress, titolo, descrizione
 * I figli sono gli input field
 */
export function StepCard({
  stepNumber,
  totalSteps,
  title,
  description,
  children,
}: StepCardProps) {
  const progressPercent = (stepNumber / totalSteps) * 100;

  return (
    <div className="pv-card space-y-6">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            Step {stepNumber} di {totalSteps}
          </span>
          <span className="text-xs font-semibold text-pv-primary">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-pv-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-2 text-slate-600">{description}</p>}
        </div>

        {/* Input children */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
