import React from 'react';

interface TextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  help?: string;
  error?: string;
  rows?: number;
  disabled?: boolean;
}

export function Textarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  help,
  error,
  rows = 5,
  disabled,
}: TextareaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-900">
        {label}
        {required && <span className="text-pv-accent ml-1">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`pv-input-base resize-none ${error ? 'border-pv-accent' : ''}`}
      />
      {help && <p className="text-xs text-slate-500">{help}</p>}
      {error && <p className="text-xs text-pv-accent">{error}</p>}
    </div>
  );
}
