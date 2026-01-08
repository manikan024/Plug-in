import React from 'react';

/**
 * PercentageField - Percentage input (0-100)
 */
function PercentageField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  placeholder,
  disabled = false,
  className = '',
  ...props 
}) {
  const handleChange = (e) => {
    const inputValue = e.target.value === '' ? null : parseFloat(e.target.value);
    let numValue = inputValue;
    
    // Clamp between 0 and 100
    if (numValue !== null && !isNaN(numValue)) {
      if (numValue < 0) numValue = 0;
      if (numValue > 100) numValue = 100;
    }
    
    if (onChange) {
      onChange(numValue, attribute);
    }
  };

  const displayValue = value !== null && value !== undefined ? value : '';
  const fieldPlaceholder = placeholder || '0';

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue !== '' ? `${displayValue}%` : <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={displayValue}
        onChange={handleChange}
        placeholder={fieldPlaceholder}
        disabled={disabled}
        min={0}
        max={100}
        step={0.01}
        className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
          disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
        } ${className}`}
        {...props}
      />
      <span className="text-base-foreground">%</span>
    </div>
  );
}

export default PercentageField;

