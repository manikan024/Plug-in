import React from 'react';

/**
 * PhoneField - Phone number input with formatting
 */
function PhoneField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  placeholder,
  disabled = false,
  phoneType,
  onPhoneTypeChange,
  className = '',
  ...props 
}) {
  const handleChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (onChange) {
      onChange(inputValue, attribute);
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const displayValue = value || '';
  const fieldPlaceholder = placeholder || attribute?.label?.modifiedLabel || '(555) 123-4567';

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue ? (
          <a 
            href={`tel:${displayValue}`}
            className="text-base-primary hover:underline"
          >
            {formatPhone(displayValue)}
          </a>
        ) : (
          <span className="text-base-muted-foreground">—</span>
        )}
      </div>
    );
  }

  const phoneTypes = attribute?.phoneTypes || [
    { id: 'mobile', name: 'Mobile' },
    { id: 'work', name: 'Work' },
    { id: 'home', name: 'Home' },
    { id: 'fax', name: 'Fax' },
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {phoneType !== undefined && (
        <select
          value={phoneType || 'mobile'}
          onChange={(e) => onPhoneTypeChange && onPhoneTypeChange(e.target.value, attribute)}
          disabled={disabled}
          className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
            disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
          }`}
        >
          {phoneTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      )}
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={fieldPlaceholder}
        disabled={disabled}
        maxLength={15}
        className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
          disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
        }`}
        {...props}
      />
    </div>
  );
}

export default PhoneField;

