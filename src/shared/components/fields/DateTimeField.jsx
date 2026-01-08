import React from 'react';

/**
 * DateTimeField - Date and time picker
 */
function DateTimeField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  className = '',
  ...props 
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, attribute);
    }
  };

  // Format date-time for display in view mode
  const formatDateTime = (dateValue) => {
    if (!dateValue) return null;
    try {
      const date = new Date(dateValue);
      return date.toLocaleString();
    } catch {
      return dateValue;
    }
  };

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {formatDateTime(value) || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  // Convert value to datetime-local format for input
  const inputValue = value 
    ? (value instanceof Date 
        ? value.toISOString().slice(0, 16)
        : new Date(value).toISOString().slice(0, 16))
    : '';

  return (
    <input
      type="datetime-local"
      value={inputValue}
      onChange={handleChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
        disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
      } ${className}`}
      {...props}
    />
  );
}

export default DateTimeField;

