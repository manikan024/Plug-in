import React from 'react';

/**
 * Common CheckboxField component that can be used by both UIRenderer and AdvancedSearchRenderer
 */
function CheckboxField({ 
  attribute, 
  value, 
  onChange, 
  options = [],
  mode = 'create',
  disabled = false,
  className = '',
  rowIndex, // Extract rowIndex to prevent it from being passed to DOM
  parentSectionRowIndex, // Extract parentSectionRowIndex to prevent it from being passed to DOM
  ...props 
}) {
  const handleChange = (optionValue, checked) => {
    if (onChange) {
      if (options.length > 0) {
        // Multi-select checkbox
        const currentValues = Array.isArray(value) ? value : [];
        let newValues;
        if (checked) {
          newValues = [...currentValues, optionValue];
        } else {
          newValues = currentValues.filter(v => v !== optionValue);
        }
        onChange(newValues, attribute);
      } else {
        // Single checkbox
        onChange(checked, attribute);
      }
    }
  };

  if (mode === 'view') {
    if (options.length > 0) {
      const selectedOptions = options.filter(opt => {
        const optValue = opt.value || opt.id;
        return Array.isArray(value) && value.includes(optValue);
      });
      return (
        <div className={`text-base-foreground ${className}`}>
          {selectedOptions.length > 0 
            ? selectedOptions.map(opt => opt.name || opt.label).join(', ')
            : <span className="text-base-muted-foreground">—</span>
          }
        </div>
      );
    }
    return (
      <div className={`text-base-foreground ${className}`}>
        {value ? 'Yes' : 'No'}
      </div>
    );
  }

  if (options.length > 0) {
    // Multi-select checkboxes - matching AngularJS toggle style
    return (
      <div className={`editObject pdtp0 clrbth ${className}`}>
        {options.map((option, index) => {
          const optionValue = option.value || option.id;
          const optionLabel = option.name || option.label || option.options?.[0];
          const isChecked = Array.isArray(value) && value.includes(optionValue);
          const toggleONColor = attribute?.toggleONColor || '#2196F3';
          const toggleOFFColor = attribute?.toggleOFFColor || '#ccc';
          const isOptionValueVisible = attribute?.isOptionValueVisible !== false;
          
          return (
            <div key={optionValue || index} className={`toggle clrbth mgn30 fltlft wd100p ${mode === 'CREATE' ? 'pd0' : 'bgimgnon'}`} index={index}>
              <div className={`switch wd63 tgllft pull-left ${disabled ? 'disabled' : ''}`} id={`${attribute?.attributeId}_${index}`}>
                <div className={`switch-animate ${isChecked ? 'switch-on' : 'switch-off'}`}>
                  <span className="switch-left" style={{ backgroundColor: toggleONColor }}></span>
                  <span className="knob">&nbsp;</span>
                  <span className="switch-right" style={{ backgroundColor: toggleOFFColor }}></span>
                </div>
              </div>
              {isOptionValueVisible && optionLabel && (
                <font className="valigntop fltlft wrdrpbkwrd">
                  <span className="pad5 fltlft wdbkwd">{optionLabel}</span>
                </font>
              )}
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleChange(optionValue, e.target.checked)}
                disabled={disabled}
                style={{ display: 'none' }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // Single checkbox/toggle
  const toggleONColor = attribute?.toggleONColor || '#2196F3';
  const toggleOFFColor = attribute?.toggleOFFColor || '#ccc';
  const isChecked = !!value;
  
  return (
    <div className={`editObject pdtp0 clrbth ${className}`}>
      <div className={`toggle clrbth mgn30 fltlft wd100p ${mode === 'CREATE' ? 'pd0' : 'bgimgnon'}`}>
        <div className={`switch wd63 tgllft pull-left ${disabled ? 'disabled' : ''}`} id={attribute?.attributeId}>
          <div className={`switch-animate ${isChecked ? 'switch-on' : 'switch-off'}`}>
            <span className="switch-left" style={{ backgroundColor: toggleONColor }}></span>
            <span className="knob">&nbsp;</span>
            <span className="switch-right" style={{ backgroundColor: toggleOFFColor }}></span>
          </div>
        </div>
        {attribute?.isOptionValueVisible !== false && (
          <font className="valigntop fltlft wrdrpbkwrd">
            <span className="pad5 fltlft wdbkwd">{attribute?.label?.modifiedLabel || 'Enable'}</span>
          </font>
        )}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleChange(e.target.checked, e.target.checked)}
          disabled={disabled}
          style={{ display: 'none' }}
          {...props}
        />
      </div>
    </div>
  );
}

export default CheckboxField;

