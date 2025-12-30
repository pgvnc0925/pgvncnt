import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  help?: string;
  error?: string;
  disabled?: boolean;
}

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  required,
  help,
  error,
  disabled,
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-900">
        {label}
        {required && <span className="text-pv-accent ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`pv-input-base ${error ? 'border-pv-accent' : ''}`}
      >
        <option value="">Seleziona un'opzione</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {help && <p className="text-xs text-slate-500">{help}</p>}
      {error && <p className="text-xs text-pv-accent">{error}</p>}
    </div>
  );
}
