import React from 'react';

export const Select = ({ 
  options = [],
  value,
  onChange,
  placeholder = 'Seleccionar...',
  disabled = false,
  className = '',
  ...props 
}) => {
  const classes = `
    w-full px-3 py-2 border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    bg-white
    ${className}
  `.trim();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};