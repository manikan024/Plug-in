import React from 'react';

/**
 * SalutationField - Salutation (Mr, Mrs, Ms, Dr, etc.) with name fields
 */
function SalutationField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  className = '',
  ...props 
}) {
  const salutationOptions = attribute?.salutationOptions || [
    { id: 'Mr', name: 'Mr' },
    { id: 'Mrs', name: 'Mrs' },
    { id: 'Ms', name: 'Ms' },
    { id: 'Dr', name: 'Dr' },
    { id: 'Prof', name: 'Prof' },
  ];

  const handleSalutationChange = (e) => {
    if (onChange) {
      onChange(e.target.value, attribute);
    }
  };

  const handleFirstNameChange = (e) => {
    if (onFirstNameChange) {
      onFirstNameChange(e.target.value, attribute);
    }
  };

  const handleLastNameChange = (e) => {
    if (onLastNameChange) {
      onLastNameChange(e.target.value, attribute);
    }
  };

  if (mode === 'view') {
    const parts = [value, firstName, lastName].filter(Boolean);
    return (
      <div className={`text-base-foreground ${className}`}>
        {parts.length > 0 ? parts.join(' ') : <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <select
          value={value || ''}
          onChange={handleSalutationChange}
          disabled={disabled}
          className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
            disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
          }`}
        >
          <option value="">Select...</option>
          {salutationOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={firstName || ''}
          onChange={handleFirstNameChange}
          placeholder="First Name"
          disabled={disabled}
          className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
            disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
          }`}
        />
        <input
          type="text"
          value={lastName || ''}
          onChange={handleLastNameChange}
          placeholder="Last Name"
          disabled={disabled}
          className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
            disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
          }`}
        />
      </div>
    </div>
  );
}

export default SalutationField;

