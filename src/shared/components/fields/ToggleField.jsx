import React from 'react';

/**
 * ToggleField - Toggle switch (on/off)
 */
function ToggleField({ 
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
      onChange(e.target.checked, attribute);
    }
  };

  const isChecked = !!value;

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {isChecked ? 'Yes' : 'No'}
      </div>
    );
  }

  const toggleONColor = attribute?.toggleONColor || '#2196F3';
  const toggleOFFColor = attribute?.toggleOFFColor || '#ccc';
  const isOptionValueVisible = attribute?.isOptionValueVisible !== false;

  return (
    <div className={`editObject pdtp0 clrbth ${className}`}>
      <div className={`toggle clrbth mgn30 fltlft wd100p ${mode === 'create' ? 'pd0' : 'bgimgnon'}`}>
        <div className={`switch wd63 tgllft pull-left ${disabled ? 'disabled' : ''}`} id={attribute?.attributeId}>
          <div className={`switch-animate ${isChecked ? 'switch-on' : 'switch-off'}`}>
            <span className="switch-left" style={{ backgroundColor: toggleONColor }}></span>
            <span className="knob">&nbsp;</span>
            <span className="switch-right" style={{ backgroundColor: toggleOFFColor }}></span>
          </div>
        </div>
        {isOptionValueVisible && (
          <font className="valigntop fltlft wrdrpbkwrd">
            <span className="pad5 fltlft wdbkwd">{attribute?.label?.modifiedLabel || (isChecked ? 'On' : 'Off')}</span>
          </font>
        )}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          style={{ display: 'none' }}
          {...props}
        />
      </div>
    </div>
  );
}

export default ToggleField;

