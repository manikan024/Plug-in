import React from 'react';

/**
 * RadioField - Radio button group
 */
function RadioField({ 
  attribute, 
  value, 
  onChange, 
  options = [],
  mode = 'create',
  disabled = false,
  className = '',
  ...props 
}) {
  const handleChange = (optionValue) => {
    if (onChange) {
      onChange(optionValue, attribute);
    }
  };

  const fieldOptions = options.length > 0 ? options : attribute?.options || [];

  if (mode === 'view') {
    const selectedOption = fieldOptions.find(opt => 
      opt.value === value || opt.id === value || opt[attribute?.valueField || 'id'] === value
    );
    const displayValue = selectedOption 
      ? (selectedOption.name || selectedOption.label || selectedOption[attribute?.displayField || 'name'])
      : value;
    
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  return (
    <div className={`radio ${className}`}>
      {fieldOptions.map((option, index) => {
        const optionValue = option.value || option.id || option[attribute?.valueField || 'id'];
        const optionLabel = option.name || option.label || option[attribute?.displayField || 'name'];
        const isChecked = value === optionValue;
        const radioName = `radio_${attribute?.attributeId || attribute?.id || 'radio'}`;
        
        return (
          <div key={optionValue || index} className="radio">
            <label>
              <input
                type="radio"
                name={radioName}
                value={optionValue}
                checked={isChecked}
                onChange={() => handleChange(optionValue)}
                disabled={disabled}
                {...props}
              />
              {optionLabel}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default RadioField;

