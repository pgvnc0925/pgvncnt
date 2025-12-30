import React from 'react';

type VerdictSeverity = 'high' | 'medium' | 'low';

interface VerdictProps {
  title: string;
  description: string;
  severity?: VerdictSeverity;
  actionRequired?: boolean;
}

const severityConfig = {
  high: {
    bg: 'from-red-50 to-red-50/50',
    border: 'border-red-200',
    icon: '⚠️',
    textColor: 'text-red-900',
  },
  medium: {
    bg: 'from-yellow-50 to-yellow-50/50',
    border: 'border-yellow-200',
    icon: '📊',
    textColor: 'text-yellow-900',
  },
  low: {
    bg: 'from-green-50 to-green-50/50',
    border: 'border-green-200',
    icon: '✓',
    textColor: 'text-green-900',
  },
};

/**
 * VERDICT (PV UX CANON)
 * Una verità singola, leggibile in 5 secondi
 * Ancora la mente prima della mappa di tensioni
 * Severità optionale per comunicare urgenza
 */
export function Verdict({
  title,
  description,
  severity = 'medium',
  actionRequired = true,
}: VerdictProps) {
  const config = severityConfig[severity];

  return (
    <div className={`pv-card bg-gradient-to-br ${config.bg} ${config.border} border-2`}>
      <div className="flex gap-4">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0">{config.icon}</div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <h3 className={`text-lg font-bold ${config.textColor}`}>{title}</h3>
          <p className={`text-sm leading-relaxed ${config.textColor}`}>{description}</p>

          {actionRequired && (
            <div className="mt-4 pt-4 border-t border-current/20">
              <p className={`text-xs font-semibold ${config.textColor} uppercase tracking-wide`}>
                Azione consigliata: vedi la mappa sottostante
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
