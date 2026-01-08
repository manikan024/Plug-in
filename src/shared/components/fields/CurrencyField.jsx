import React, { useState, useEffect } from 'react';

/**
 * CurrencyField - Handles currency input with currency code selection
 */
function CurrencyField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  placeholder,
  disabled = false,
  currencyCode,
  availableCurrencies = [],
  onCurrencyChange,
  className = '',
  ...props 
}) {
  const [currentCurrency, setCurrentCurrency] = useState(currencyCode || 'USD');
  const [amount, setAmount] = useState(value || 0);

  useEffect(() => {
    if (currencyCode) {
      setCurrentCurrency(currencyCode);
    }
  }, [currencyCode]);

  useEffect(() => {
    setAmount(value || 0);
  }, [value]);

  const handleAmountChange = (e) => {
    const inputValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setAmount(inputValue);
    
    if (onChange) {
      const newValue = {
        amount: inputValue,
        currencyCode: currentCurrency,
      };
      onChange(newValue, attribute);
    }
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrentCurrency(newCurrency);
    
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency, attribute);
    }
    
    if (onChange) {
      onChange({
        amount: amount,
        currencyCode: newCurrency,
      }, attribute);
    }
  };

  if (mode === 'view') {
    const formattedAmount = formatCurrency(amount, currentCurrency);
    return (
      <div className={`text-base-foreground ${className}`}>
        {formattedAmount || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  const defaultCurrencies = availableCurrencies.length > 0 
    ? availableCurrencies 
    : [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
      ];

  const isMultiCurrency = attribute?.isMultiCurrency === true;
  const isTableAttribute = attribute?.isTableAttribute === true;
  const isRightAligned = attribute?.isRightAligned;
  const placeHolder = placeholder || attribute?.placeHolder || '0.00';
  const displayAmount = amount || '';

  if (isMultiCurrency) {
    return (
      <div className={className}>
        <div className={`pdrgt5 fltlft pdlft0 ${isTableAttribute ? 'col-xs-7' : 'col-xs-9'}`}>
          <input
            className={`form-control input-sm ${isRightAligned ? 'txtrgt' : ''}`}
            placeholder={placeHolder}
            type="text"
            value={displayAmount}
            onChange={handleAmountChange}
            disabled={disabled}
            {...props}
          />
        </div>
        <div className={`pd0 fltlft ${isTableAttribute ? 'adjustminwd col-xs-5' : 'col-xs-3'}`}>
          <div className="select2 select2-container chosen-container chosen-container-single">
            <a className="chosen-single ui-select-match" placeholder="Select one">
              <span className="select2-chosen">{currentCurrency}</span>
              <div className="select2-arrow"><b></b></div>
            </a>
          </div>
          <select
            value={currentCurrency}
            onChange={handleCurrencyChange}
            disabled={disabled}
            style={{ display: 'none' }}
          >
            {defaultCurrencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.symbol} {curr.code}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className={`input-group clrbth ${className}`}>
      <input
        className={`form-control input-sm ${isRightAligned ? 'txtrgt' : ''}`}
        placeholder={placeHolder}
        type="text"
        value={displayAmount}
        onChange={handleAmountChange}
        disabled={disabled}
        {...props}
      />
      <span className="input-group-addon">{currentCurrency}</span>
    </div>
  );
}

function formatCurrency(amount, currencyCode = 'USD') {
  if (amount === null || amount === undefined) return '';
  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(numAmount)) return amount;
  
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };
  
  const symbol = currencySymbols[currencyCode] || currencyCode;
  return `${symbol}${numAmount.toFixed(2)}`;
}

export default CurrencyField;

