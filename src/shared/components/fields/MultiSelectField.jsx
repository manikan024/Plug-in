import React, { useState } from 'react';

/**
 * MultiSelectField - Multi-select dropdown
 */
function MultiSelectField({ 
  attribute, 
  value, 
  onChange, 
  options = [],
  mode = 'create',
  disabled = false,
  className = '',
  ...props 
}) {
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
  const fieldOptions = options.length > 0 ? options : attribute?.options || [];

  const handleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    if (onChange) {
      onChange(selectedOptions, attribute);
    }
  };

  if (mode === 'view') {
    const selectedOptions = fieldOptions.filter(opt => {
      const optValue = opt.value || opt.id || opt[attribute?.valueField || 'id'];
      return selectedValues.includes(optValue);
    });
    return (
      <div className={`text-base-foreground ${className}`}>
        {selectedOptions.length > 0 
          ? selectedOptions.map(opt => opt.name || opt.label).join(', ')
          : <span className="text-base-muted-foreground">—</span>
        }
      </div>
    );
  }

  return (
    <select
      multiple
      value={selectedValues}
      onChange={handleChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus min-h-[100px] ${
        disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
      } ${className}`}
      {...props}
    >
      {fieldOptions.map((option, index) => {
        const optionValue = option.value || option.id || option[attribute?.valueField || 'id'];
        const optionLabel = option.name || option.label || option[attribute?.displayField || 'name'];
        return (
          <option key={optionValue || index} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
}

export default MultiSelectField;

