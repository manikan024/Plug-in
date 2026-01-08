import React from 'react';

/**
 * LinkField - Displays clickable links
 */
function LinkField({ 
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
    if (onChange) {
      onChange(e.target.value, attribute);
    }
  };

  const displayValue = value || '';
  const fieldPlaceholder = placeholder || attribute?.label?.modifiedLabel || '';

  if (mode === 'view') {
    const url = displayValue.startsWith('http') ? displayValue : `https://${displayValue}`;
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-base-primary hover:underline"
          >
            {displayValue}
          </a>
        ) : (
          <span className="text-base-muted-foreground">—</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={fieldPlaceholder}
        disabled={disabled}
        className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
          disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
        } ${className}`}
        {...props}
      />
    </div>
  );
}

export default LinkField;

