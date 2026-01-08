import React from 'react';

/**
 * TimeField - Time picker
 */
function TimeField({ 
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

  // Format time for display in view mode
  const formatTime = (timeValue) => {
    if (!timeValue) return null;
    try {
      if (typeof timeValue === 'string' && timeValue.includes(':')) {
        const [hours, minutes] = timeValue.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
      }
      return timeValue;
    } catch {
      return timeValue;
    }
  };

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {formatTime(value) || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  // Convert value to HH:mm format for input
  const inputValue = value 
    ? (typeof value === 'string' && value.includes(':')
        ? value.slice(0, 5)
        : new Date(value).toTimeString().slice(0, 5))
    : '';

  return (
    <input
      type="time"
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

export default TimeField;

