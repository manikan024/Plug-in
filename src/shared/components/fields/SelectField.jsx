import React from 'react';
import { Select, SelectOption } from '../../ui/select';

/**
 * Common SelectField component that can be used by both UIRenderer and AdvancedSearchRenderer
 */
function SelectField({ 
  attribute, 
  value, 
  onChange, 
  options = [],
  mode = 'create',
  placeholder,
  disabled = false,
  multiple = false,
  className = '',
  rowIndex, // Extract rowIndex to prevent it from being passed to DOM
  parentSectionRowIndex, // Extract parentSectionRowIndex to prevent it from being passed to DOM
  ...props 
}) {
  const handleChange = (e) => {
    if (onChange) {
      if (multiple) {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        onChange(selectedOptions, attribute);
      } else {
        onChange(e.target.value, attribute);
      }
    }
  };

  if (mode === 'view') {
    const selectedOption = options.find(opt => {
      const optValue = opt.value || opt.id || opt[attribute?.valueField || 'id'];
      return optValue === value;
    });
    const displayValue = selectedOption 
      ? (selectedOption.name || selectedOption.label || selectedOption[attribute?.displayField || 'name'])
      : value;
    
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  // Render using UI Select component (React-plugin pattern)
  return (
    <div className={className}>
      <Select
        id={attribute?.attributeId}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        multiple={multiple}
        {...props}
      >
        <SelectOption value="">{placeholder || 'Please choose'}</SelectOption>
        {options.map((option, index) => {
          const optionValue = option.value || option.id || option[attribute?.valueField || 'id'];
          const optionLabel = option.name || option.label || option[attribute?.displayField || 'name'];
          return (
            <SelectOption key={optionValue || index} value={optionValue}>
              {optionLabel}
            </SelectOption>
          );
        })}
      </Select>
    </div>
  );
}

export default SelectField;

