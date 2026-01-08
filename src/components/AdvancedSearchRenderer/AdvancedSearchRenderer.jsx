import React, { useState, useEffect, useCallback } from 'react';
import Section from '../../shared/components/Section';
import { getValidSections, getAttributeValue, setAttributeValue } from '../../shared/utils/attributeUtils';
import { performAdvancedSearch } from '../../services/api';

/**
 * AdvancedSearchRenderer - Component for rendering advanced search forms
 * Similar to uiAdvSearchRenderer directive in AngularJS app-ui-advsearch
 * Calls API when search is performed
 */
function AdvancedSearchRenderer({
  uiOptions = {},
  formData: externalFormData,
  onFormDataChange,
  onSearch,
  onReset,
  objectId,
  className = '',
}) {
  const [searching, setSearching] = useState(false);
  const [formData, setFormData] = useState(() => {
    // Initialize from externalFormData or uiOptions.objectIdx only once
    return externalFormData || uiOptions.objectIdx || {};
  });
  const [sections, setSections] = useState([]);
  const isInitializedRef = useRef(false);

  // Initialize form data only once on mount or when uiOptions.objectIdx changes
  useEffect(() => {
    // Only initialize once or when uiOptions.objectIdx changes (not from externalFormData)
    if (!isInitializedRef.current && uiOptions.objectIdx) {
      setFormData(uiOptions.objectIdx || {});
      isInitializedRef.current = true;
    }
  }, [uiOptions.objectIdx]);

  // Initialize sections
  useEffect(() => {
    if (uiOptions.WEB_LAYOUT?.sections) {
      const validSections = getValidSections(
        uiOptions.WEB_LAYOUT.sections,
        'search',
        uiOptions.configData
      );
      setSections(validSections);
    }
  }, [uiOptions.WEB_LAYOUT, uiOptions.configData]);

  // Handle field changes
  const handleFieldChange = useCallback((attribute, value, rowIndex = null) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      setAttributeValue(attribute, newData, value, rowIndex);
      
      // Notify parent component (but don't sync back from parent to prevent loops)
      if (onFormDataChange) {
        onFormDataChange(newData, attribute, value);
      }
      
      return newData;
    });
  }, [onFormDataChange]);

  // Handle search - call API if objectId is provided
  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    
    if (!objectId) {
      // Fallback to callback if no objectId
      if (onSearch) {
        onSearch(formData);
      }
      return;
    }

    setSearching(true);
    try {
      // Build search criteria from formData
      const buildSearchCriteria = (formData, uiOptions) => {
        const criteria = [];
        
        // Extract search criteria from formData
        Object.keys(formData).forEach((key) => {
          const value = formData[key];
          if (value !== undefined && value !== null && value !== '') {
            // Find attribute by tagName
            const attribute = uiOptions.WEB_LAYOUT?.sections
              ?.flatMap(s => s.attributes || [])
              ?.find(attr => attr.tagName === key || attr.right?.[0]?.tagName === key);

            if (attribute) {
              criteria.push({
                attributeId: attribute.attributeId || key,
                operator: 'equals', // Default operator - can be enhanced
                value: value,
              });
            }
          }
        });

        return criteria;
      };

      const searchCriteria = {
        criteria: buildSearchCriteria(formData, uiOptions),
      };

      // Call advanced search API
      const results = await performAdvancedSearch(searchCriteria, objectId);
      console.log('Advanced search results:', results);

      // Call onSearch callback with results
      if (onSearch) {
        onSearch(results.data || results);
      }
    } catch (error) {
      console.error('Error performing advanced search:', error);
      alert('Error performing search: ' + (error.message || 'Unknown error'));
    } finally {
      setSearching(false);
    }
  }, [formData, onSearch, objectId, uiOptions]);

  // Handle reset
  const handleReset = useCallback(() => {
    const emptyData = {};
    setFormData(emptyData);
    if (onReset) {
      onReset(emptyData);
    }
  }, [onReset]);

  if (!uiOptions || !uiOptions.WEB_LAYOUT) {
    return (
      <div className="text-base-muted-foreground p-4">
        Loading search form...
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="text-base-muted-foreground p-4">
        No search criteria available. The form configuration may not include searchable fields.
      </div>
    );
  }

  return (
    <div className={`advanced-search-renderer bg-white ${className}`}>
      <form onSubmit={handleSearch} className="space-y-6">
        {sections.map((section, index) => (
          <Section
            key={section.sectionId || section.id || index}
            section={section}
            formData={formData}
            onFieldChange={handleFieldChange}
            mode="search"
            collapsible={true}
            defaultCollapsed={false}
            configData={uiOptions.configData}
          />
        ))}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-base-border rounded-md text-base-foreground hover:bg-base-muted"
          >
            Reset
          </button>
          {onSearch && (
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-base-primary text-base-primaryForeground rounded-md hover:bg-base-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdvancedSearchRenderer;

