import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  required?: boolean;
  help?: string;
  error?: string;
}

export function CheckboxGroup({
  id,
  label,
  values,
  onChange,
  options,
  required,
  help,
  error,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-900">
        {label}
        {required && <span className="text-pv-accent ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="w-4 h-4 rounded border-slate-300 accent-pv-primary cursor-pointer"
            />
            <span className="ml-3 text-sm text-slate-700">{option.label}</span>
          </label>
        ))}
      </div>
      {help && <p className="text-xs text-slate-500">{help}</p>}
      {error && <p className="text-xs text-pv-accent">{error}</p>}
    </div>
  );
}
