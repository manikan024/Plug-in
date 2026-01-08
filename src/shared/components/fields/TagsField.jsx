import React, { useState } from 'react';

/**
 * TagsField - Multi-select tags (select_search)
 */
function TagsField({ 
  attribute, 
  value, 
  onChange, 
  options = [],
  mode = 'create',
  disabled = false,
  placeholder = 'Select or type...',
  className = '',
  ...props 
}) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Normalize selected values - handle both objects and primitives
  const normalizeValue = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'object') {
      // If it's an object, extract the ID
      return val.id || val.value || val.labelId || val[attribute?.valueField || 'id'] || null;
    }
    return val;
  };

  const normalizeValues = (vals) => {
    if (!vals) return [];
    const arr = Array.isArray(vals) ? vals : [vals];
    return arr.map(normalizeValue).filter(v => v !== null);
  };

  const selectedValues = normalizeValues(value);
  const fieldOptions = options.length > 0 ? options : attribute?.options || [];

  // Helper to get display label from value
  const getDisplayLabel = (val) => {
    if (val === null || val === undefined) return '';
    
    // If val is an object, extract label
    if (typeof val === 'object') {
      return val.labelName || val.name || val.label || val[attribute?.displayField || 'name'] || String(val.id || val.value || '');
    }
    
    // If val is a primitive, find matching option
    const option = fieldOptions.find(opt => {
      const optValue = normalizeValue(opt);
      return optValue === val || opt.id === val || opt.value === val;
    });
    
    if (option) {
      const label = option.labelName || option.name || option.label || option[attribute?.displayField || 'name'];
      // Ensure label is a string, not an object
      return typeof label === 'object' ? String(label.id || label.value || '') : String(label || '');
    }
    
    return String(val);
  };

  const handleAddTag = (optionValue) => {
    const normalizedValue = normalizeValue(optionValue);
    if (normalizedValue === null) return;
    
    if (!selectedValues.includes(normalizedValue)) {
      const newValues = [...selectedValues, normalizedValue];
      if (onChange) {
        onChange(newValues, attribute);
      }
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    const normalizedTag = normalizeValue(tagToRemove);
    const newValues = selectedValues.filter(v => {
      const normalizedV = normalizeValue(v);
      return normalizedV !== normalizedTag;
    });
    if (onChange) {
      onChange(newValues.length > 0 ? newValues : [], attribute);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const filteredOptions = fieldOptions.filter(opt => {
    const optLabel = opt.labelName || opt.name || opt.label || opt[attribute?.displayField || 'name'];
    const optLabelStr = typeof optLabel === 'object' ? String(optLabel.id || optLabel.value || '') : String(optLabel || '');
    const optValue = normalizeValue(opt);
    return optLabelStr.toLowerCase().includes(inputValue.toLowerCase()) &&
           !selectedValues.includes(optValue);
  });

  if (mode === 'view') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {selectedValues.length > 0 ? (
          selectedValues.map((val, index) => {
            const label = getDisplayLabel(val);
            return (
              <span 
                key={`${normalizeValue(val)}-${index}`}
                className="px-2 py-1 bg-base-muted text-base-foreground rounded-md text-sm"
              >
                {label}
              </span>
            );
          })
        ) : (
          <span className="text-base-muted-foreground">—</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border border-base-border rounded-md min-h-[42px] bg-base-input">
        {selectedValues.map((val, index) => {
          const label = getDisplayLabel(val);
          const normalizedVal = normalizeValue(val);
          return (
            <span
              key={`${normalizedVal}-${index}`}
              className="px-2 py-1 bg-base-primary text-base-primaryForeground rounded-md text-sm flex items-center gap-1"
            >
              {label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(val)}
                  className="hover:text-semantic-destructive"
                >
                  ×
                </button>
              )}
            </span>
          );
        })}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedValues.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          {...props}
        />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-base-card border border-base-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => {
            const optionValue = normalizeValue(option);
            const optionLabelRaw = option.labelName || option.name || option.label || option[attribute?.displayField || 'name'];
            const optionLabel = typeof optionLabelRaw === 'object' 
              ? String(optionLabelRaw.id || optionLabelRaw.value || '') 
              : String(optionLabelRaw || '');
            return (
              <div
                key={optionValue || `option-${index}`}
                onClick={() => handleAddTag(option)}
                className="px-3 py-2 hover:bg-base-muted cursor-pointer"
              >
                {optionLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TagsField;

