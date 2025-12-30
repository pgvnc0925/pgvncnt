import React from 'react';
import { TensionAxis } from '@/lib/app-types';

interface TensionMapProps {
  axes: TensionAxis[];
  summary: string;
  implications: string[];
}

/**
 * TENSION MAP (PV UX CANON)
 * Visualizza il gap tra:
 * - cosa l'utente pensa (posizione sinistra)
 * - cosa il mercato probabilmente percepisce (posizione destra)
 *
 * Mostra 2-4 assi di tensione in matrice
 * Spiega le implicazioni senza diluire il verdetto
 */
export function TensionMap({ axes, summary, implications }: TensionMapProps) {
  return (
    <div className="space-y-8">
      {/* Grid di assi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {axes.map((axis, idx) => {
          const gap = Math.abs(axis.userPosition - axis.marketPosition);
          const gapPercentage = (gap / 100) * 100;

          return (
            <div key={idx} className="pv-card space-y-4">
              <h4 className="font-semibold text-slate-900">{axis.name}</h4>

              {/* Slider visualization */}
              <div className="space-y-3">
                {/* User position */}
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">Tu pensi</span>
                    <span className="text-pv-primary font-bold">{axis.userPosition}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pv-primary transition-all duration-300"
                      style={{ width: `${axis.userPosition}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{axis.leftLabel}</span>
                    <span>{axis.rightLabel}</span>
                  </div>
                </div>

                {/* Market position */}
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">Il mercato percepisce</span>
                    <span className="text-pv-accent font-bold">{axis.marketPosition}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pv-accent transition-all duration-300"
                      style={{ width: `${axis.marketPosition}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Gap indicator */}
              {gap > 0 && (
                <div
                  className={`px-3 py-2 rounded-lg text-xs font-medium ${
                    gap > 40
                      ? 'bg-red-100 text-red-900'
                      : gap > 20
                        ? 'bg-yellow-100 text-yellow-900'
                        : 'bg-green-100 text-green-900'
                  }`}
                >
                  Gap: {gap} punti
                </div>
              )}

              {/* Insight */}
              <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">
                {axis.insight}
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary e implications */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-4">
        <div>
          <h5 className="font-semibold text-slate-900 mb-2">Sintesi</h5>
          <p className="text-sm text-slate-700">{summary}</p>
        </div>

        <div>
          <h5 className="font-semibold text-slate-900 mb-2">Implicazioni</h5>
          <ul className="space-y-2">
            {implications.map((impl, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 text-pv-primary font-bold">→</span>
                <span>{impl}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
