import React, { useState } from 'react';

/**
 * ReferenceField - Reference to another object (with search/autocomplete)
 */
function ReferenceField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  referenceObject,
  onSearch,
  onSelect,
  className = '',
  rowIndex, // Extract rowIndex to prevent it from being passed to DOM
  parentSectionRowIndex, // Extract parentSectionRowIndex to prevent it from being passed to DOM
  ...props 
}) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.length >= 2 && onSearch) {
      setIsSearching(true);
      try {
        const results = await onSearch(text, attribute);
        setSearchResults(results || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (item) => {
    setSearchText(item.name || item[referenceObject?.objectRefName || 'name'] || '');
    setShowResults(false);
    if (onChange) {
      onChange(item, attribute);
    }
    if (onSelect) {
      onSelect(item, attribute);
    }
  };

  const displayValue = value 
    ? (typeof value === 'object' 
        ? (value.name || value[referenceObject?.objectRefName || 'name'] || '')
        : value)
    : '';

  if (mode === 'view') {
    return (
      <div className={`text-base-foreground ${className}`}>
        {displayValue || <span className="text-base-muted-foreground">—</span>}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchText || displayValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={attribute?.label?.modifiedLabel || 'Search...'}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
              disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
            }`}
            {...props}
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5 text-base-muted-foreground">
              Searching...
            </div>
          )}
        </div>
        {onSearch && (
          <button
            type="button"
            onClick={() => handleSearch(searchText || displayValue)}
            disabled={disabled || isSearching}
            className="px-4 py-2 border border-base-border rounded-md hover:bg-base-muted"
          >
            🔍
          </button>
        )}
      </div>
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-base-card border border-base-border rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.map((item, index) => {
            const itemName = item.name || item[referenceObject?.objectRefName || 'name'] || '';
            return (
              <div
                key={item.id || index}
                onClick={() => handleSelect(item)}
                className="px-3 py-2 hover:bg-base-muted cursor-pointer"
              >
                {itemName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReferenceField;

