// src/components/primitives/Select.tsx
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ options, label, id, ...props }) => {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={selectId} className="text-sm text-neutral-700 mb-1">{label}</label>}
      <select id={selectId} className="px-2 py-1 border rounded text-sm" {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};
