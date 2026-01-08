import React from 'react';

/**
 * NumberField - Handles numeric input with validation
 */
function NumberField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  placeholder,
  disabled = false,
  min,
  max,
  step,
  className = '',
  rowIndex, // Extract rowIndex to prevent it from being passed to DOM
  parentSectionRowIndex, // Extract parentSectionRowIndex to prevent it from being passed to DOM
  ...props 
}) {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    let numValue = inputValue === '' ? null : parseFloat(inputValue);
    
    // Validate min/max
    if (numValue !== null && !isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        numValue = min;
      }
      if (max !== undefined && numValue > max) {
        numValue = max;
      }
    }
    
    if (onChange) {
      onChange(numValue, attribute);
    }
  };

  const displayValue = value !== null && value !== undefined ? value : '';
  const fieldPlaceholder = placeholder || attribute?.label?.modifiedLabel || '';

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue !== '' ? formatNumber(displayValue, attribute) : <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  const isRightAligned = attribute?.isRightAligned;
  
  return (
    <input
      type="number"
      id={attribute?.attributeId}
      value={displayValue}
      onChange={handleChange}
      placeholder={fieldPlaceholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step || 1}
      className={`form-control input-sm ${isRightAligned ? 'txtrgt' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      {...props}
    />
  );
}

function formatNumber(value, attribute) {
  if (value === null || value === undefined) return '';
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) return value;
  
  // Format based on attribute settings
  const decimals = attribute?.decimalPlaces || 0;
  return numValue.toFixed(decimals);
}

export default NumberField;

