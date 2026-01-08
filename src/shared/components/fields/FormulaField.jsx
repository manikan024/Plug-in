import React, { useEffect } from 'react';

/**
 * FormulaField - Read-only formula field (calculated value)
 */
function FormulaField({ 
  attribute, 
  value, 
  formula,
  mode = 'create',
  className = '',
  ...props 
}) {
  // Formula fields are always read-only
  const displayValue = value !== null && value !== undefined ? value : '';

  // Format based on formula type
  const formatValue = (val, formulaType) => {
    if (val === null || val === undefined) return '';
    
    if (formulaType === 'currency' || attribute?.formulaType === 'currency') {
      return formatCurrency(val);
    }
    if (formulaType === 'percentage' || attribute?.formulaType === 'percentage') {
      return `${val}%`;
    }
    if (formulaType === 'date' || attribute?.formulaType === 'date') {
      return formatDate(val);
    }
    
    return val;
  };

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(numAmount)) return amount;
    return `$${numAmount.toFixed(2)}`;
  };

  const formatDate = (dateValue) => {
    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString();
    } catch {
      return dateValue;
    }
  };

  return (
    <div className={`text-base-foreground ${className}`}>
      {displayValue !== '' 
        ? formatValue(displayValue, formula?.type || attribute?.formulaType)
        : <span className="text-base-muted-foreground">—</span>
      }
    </div>
  );
}

export default FormulaField;

