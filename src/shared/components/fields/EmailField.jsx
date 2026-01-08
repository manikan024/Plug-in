import React from 'react';

/**
 * EmailField - Email input with validation
 */
function EmailField({ 
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const displayValue = value || '';
  const fieldPlaceholder = placeholder || attribute?.label?.modifiedLabel || 'Enter email';
  const isValid = displayValue === '' || validateEmail(displayValue);

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue ? (
          <a 
            href={`mailto:${displayValue}`}
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
    <div>
      <input
        type="email"
        value={displayValue}
        onChange={handleChange}
        placeholder={fieldPlaceholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          isValid ? 'border-base-border focus:ring-base-focus' : 'border-semantic-destructive focus:ring-semantic-destructive'
        } ${
          disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
        } ${className}`}
        {...props}
      />
      {!isValid && displayValue && (
        <p className="text-sm text-semantic-destructive mt-1">Please enter a valid email address</p>
      )}
    </div>
  );
}

export default EmailField;

