import React, { useState, useEffect } from 'react';

/**
 * AddressField - Address input with country/state dependencies
 */
function AddressField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  countries = [],
  states = [],
  onCountryChange,
  className = '',
  ...props 
}) {
  const [address, setAddress] = useState(value || {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [currentStates, setCurrentStates] = useState(states);

  useEffect(() => {
    if (value) {
      setAddress(value);
    }
  }, [value]);

  useEffect(() => {
    if (address.country && onCountryChange) {
      // Filter states based on selected country
      const countryStates = states.filter(s => s.countryId === address.country);
      setCurrentStates(countryStates);
    }
  }, [address.country, states, onCountryChange]);

  const handleFieldChange = (field, fieldValue) => {
    const newAddress = { ...address, [field]: fieldValue };
    setAddress(newAddress);
    
    if (onChange) {
      onChange(newAddress, attribute);
    }
    
    if (field === 'country' && onCountryChange) {
      onCountryChange(fieldValue, attribute);
    }
  };

  const defaultCountries = countries.length > 0 ? countries : [
    { id: 'US', name: 'United States' },
    { id: 'CA', name: 'Canada' },
    { id: 'GB', name: 'United Kingdom' },
  ];

  if (mode === 'view') {
    const addressParts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    
    return (
      <div className={`text-base-foreground ${className}`}>
        {addressParts.length > 0 ? addressParts.join(', ') : <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        type="text"
        value={address.street || ''}
        onChange={(e) => handleFieldChange('street', e.target.value)}
        placeholder="Street Address"
        disabled={disabled}
        className={`w-full px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
          disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
        }`}
      />
      
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={address.city || ''}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          placeholder="City"
          disabled={disabled}
          className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
            disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
          }`}
        />
        
        <input
          type="text"
          value={address.zipCode || ''}
          onChange={(e) => handleFieldChange('zipCode', e.target.value)}
          placeholder="ZIP/Postal Code"
          disabled={disabled}
          className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
            disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
          }`}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <select
          value={address.country || ''}
          onChange={(e) => handleFieldChange('country', e.target.value)}
          disabled={disabled}
          className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
            disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
          }`}
        >
          <option value="">Select Country</option>
          {defaultCountries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        
        {currentStates.length > 0 ? (
          <select
            value={address.state || ''}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            disabled={disabled}
            className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
              disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
            }`}
          >
            <option value="">Select State</option>
            {currentStates.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={address.state || ''}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            placeholder="State/Province"
            disabled={disabled}
            className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
              disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default AddressField;

