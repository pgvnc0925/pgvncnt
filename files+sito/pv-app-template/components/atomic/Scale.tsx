import React from 'react';

interface ScaleProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
  help?: string;
  error?: string;
}

export function Scale({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  leftLabel,
  rightLabel,
  help,
  error,
}: ScaleProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <label htmlFor={id} className="block text-sm font-medium text-slate-900">
          {label}
        </label>
        <span className="text-lg font-semibold text-pv-primary">{value}</span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pv-primary"
      />

      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-slate-600">
          {leftLabel && <span>{leftLabel}</span>}
          {rightLabel && <span>{rightLabel}</span>}
        </div>
      )}

      {help && <p className="text-xs text-slate-500">{help}</p>}
      {error && <p className="text-xs text-pv-accent">{error}</p>}
    </div>
  );
}
