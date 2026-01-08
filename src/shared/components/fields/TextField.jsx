import React, { useCallback } from 'react';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import { applyCaseConversion, validateDataType, validateKeyPress } from './fieldUtils';

/**
 * TextField - Enhanced with React-plugin patterns and apptivo-ng-ui logic
 */
function TextField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  placeholder,
  disabled = false,
  className = '',
  onFocus,
  onBlur,
  caseConversion,
  dataTypeRule,
  rowIndex, // Extract rowIndex to prevent it from being passed to DOM
  parentSectionRowIndex, // Extract parentSectionRowIndex to prevent it from being passed to DOM
  ...props 
}) {
  const handleChange = useCallback((e) => {
    let newValue = e.target.value;
    
    // Apply data type rule first (filter invalid characters)
    if (dataTypeRule?.isEnabled && dataTypeRule?.type) {
      newValue = validateDataType(newValue, dataTypeRule.type);
    }

    // Apply case conversion (transform the text)
    if (caseConversion?.isEnabled && caseConversion?.type) {
      newValue = applyCaseConversion(newValue, caseConversion.type);
    }

    // Prevent input beyond maxLength
    if (attribute?.maxLength && newValue.length > attribute.maxLength) {
      newValue = newValue.slice(0, attribute.maxLength);
    }

    if (onChange) {
      onChange(newValue, attribute);
    }
  }, [onChange, attribute, caseConversion, dataTypeRule]);

  const handleKeyPress = useCallback((e) => {
    // Prevent invalid characters from being typed
    if (dataTypeRule?.isEnabled) {
      validateKeyPress(e, dataTypeRule);
    }
  }, [dataTypeRule]);

  const handlePaste = useCallback((e) => {
    // Handle paste with a small delay to process pasted content
    setTimeout(() => {
      const pastedValue = e.target.value;
      let newValue = pastedValue;

      // Apply data type rule first (filter invalid characters)
      if (dataTypeRule?.isEnabled && dataTypeRule?.type) {
        newValue = validateDataType(newValue, dataTypeRule.type);
      }

      // Apply case conversion (transform the text)
      if (caseConversion?.isEnabled && caseConversion?.type) {
        newValue = applyCaseConversion(newValue, caseConversion.type);
      }

      if (newValue !== pastedValue && onChange) {
        onChange(newValue, attribute);
      }
    }, 100);
  }, [onChange, attribute, caseConversion, dataTypeRule]);

  const displayValue = value || '';
  const fieldPlaceholder = placeholder || attribute?.placeHolder || '';
  const isRightAligned = attribute?.isRightAligned;
  const isDisabled = disabled || attribute?.isDisabled === true;

  if (mode === 'view') {
    return (
      <div className={cn("text-base-foreground", className)}>
        {displayValue || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  return (
    <div className={className}>
      <Input
        type="text"
        id={attribute?.attributeId}
        value={displayValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={handleKeyPress}
        onPaste={handlePaste}
        placeholder={fieldPlaceholder}
        disabled={isDisabled}
        maxLength={attribute?.maxLength}
        title={displayValue}
        className={cn(
          isRightAligned && "text-right",
          className
        )}
        {...props}
      />
    </div>
  );
}

export default TextField;

