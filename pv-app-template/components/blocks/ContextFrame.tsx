import React from 'react';

interface ContextFrameProps {
  title: string;
  description: string;
  whatWellDo?: string[];
  whatWeWontDo?: string[];
}

/**
 * CONTEXT FRAMING (PV UX CANON)
 * Definisce cosa faremo, perché è rilevante, cosa NON faremo
 * Massimizzare chiarezza cognitiva PRIMA di domande
 */
export function ContextFrame({
  title,
  description,
  whatWellDo,
  whatWeWontDo,
}: ContextFrameProps) {
  return (
    <div className="pv-card bg-gradient-to-br from-blue-50 to-transparent border-blue-200">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">{description}</p>
        </div>

        {whatWellDo && whatWellDo.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">✓ Quello che faremo</h3>
            <ul className="space-y-1">
              {whatWellDo.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {whatWeWontDo && whatWeWontDo.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">✗ Quello che NON faremo</h3>
            <ul className="space-y-1">
              {whatWeWontDo.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
