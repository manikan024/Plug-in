import React from 'react';

/**
 * Common TextAreaField component that can be used by both UIRenderer and AdvancedSearchRenderer
 */
function TextAreaField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  rows = 4,
  className = '',
  rowIndex, // Extract rowIndex to prevent it from being passed to DOM
  parentSectionRowIndex, // Extract parentSectionRowIndex to prevent it from being passed to DOM
  ...props 
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, attribute);
    }
  };

  const displayValue = value || '';

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground whitespace-pre-wrap ${className}`}>
        {displayValue || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  return (
    <textarea
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      rows={rows}
      className={`form-control input-sm ${disabled ? 'disabled' : ''} ${className}`}
      maxLength={attribute?.maxLength}
      {...props}
    />
  );
}

export default TextAreaField;

