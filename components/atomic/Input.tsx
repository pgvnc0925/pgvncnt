import React from 'react';

interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  help?: string;
  error?: string;
  disabled?: boolean;
}

export function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  help,
  error,
  disabled,
}: InputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-900">
        {label}
        {required && <span className="text-pv-accent ml-1">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`pv-input-base ${error ? 'border-pv-accent' : ''}`}
      />
      {help && <p className="text-xs text-slate-500">{help}</p>}
      {error && <p className="text-xs text-pv-accent">{error}</p>}
    </div>
  );
}
