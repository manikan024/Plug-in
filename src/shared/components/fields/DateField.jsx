import React from 'react';

/**
 * Common DateField component that can be used by both UIRenderer and AdvancedSearchRenderer
 */
function DateField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  className = '',
  rowIndex, // Extract rowIndex to prevent it from being passed to DOM
  parentSectionRowIndex, // Extract parentSectionRowIndex to prevent it from being passed to DOM
  ...props 
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, attribute);
    }
  };

  // Format date for display in view mode
  const formatDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString();
    } catch {
      return dateValue;
    }
  };

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {formatDate(value) || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  // Convert value to YYYY-MM-DD format for input
  const getInputValue = () => {
    if (!value) return '';
    
    try {
      let date;
      if (value instanceof Date) {
        date = value;
      } else if (typeof value === 'string') {
        // Handle empty string or invalid date strings
        if (value.trim() === '') return '';
        date = new Date(value);
      } else {
        return '';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Invalid date value:', value, error);
      return '';
    }
  };

  const inputValue = getInputValue();

  const dateFormat = attribute?.dateFormat || 'MM/DD/YYYY';
  const hasDefaultValue = attribute?.hasDefaultValue;

  return (
    <div className={`col-xs-12 pd0 ${className}`}>
      {!disabled ? (
        <div className="input-append date input-group input-append date input-group clrbth">
          <input
            id={attribute?.attributeId}
            type="text"
            value={inputValue || ''}
            onChange={handleChange}
            className={`form-control input-sm pdlft2 ${hasDefaultValue ? 'apptivo-date-attribute' : ''}`}
            maxLength={10}
            placeholder={dateFormat.toLowerCase()}
            autoComplete="off"
            disabled={disabled}
            {...props}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="button">
              <i className="icon icon-calendar"></i>
            </button>
          </span>
        </div>
      ) : (
        <div className="input-append date input-group input-append date input-group clrbth wd100p">
          <input
            id={attribute?.attributeId}
            type="text"
            value={inputValue || ''}
            className={`form-control input-sm pdlft2 disabled ${hasDefaultValue ? 'apptivo-date-attribute' : ''}`}
            maxLength={10}
            placeholder={dateFormat.toLowerCase()}
            autoComplete="off"
            disabled={true}
            {...props}
          />
        </div>
      )}
    </div>
  );
}

export default DateField;

