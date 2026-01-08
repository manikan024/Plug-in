import React, { useState, useEffect, useCallback, useRef } from 'react';
import Section from '../../shared/components/Section';
import { getValidSections, getAttributeValue, setAttributeValue } from '../../shared/utils/attributeUtils';
import { initializeUIRenderer } from '../../shared/services/uiRendererInitializationService';

/**
 * UIRenderer - Main component for rendering forms
 * Replicates the exact initialization flow from apptivo-ng-ui uiRender.js directive
 * Matches the initialization sequence inch by inch
 */
function UIRenderer({
  uiOptions: externalUiOptions = {},
  mode = 'create', // 'create', 'view', or 'edit'
  formData: externalFormData,
  onFormDataChange,
  onSave,
  onCancel,
  className = '',
}) {
  const [formData, setFormData] = useState(externalFormData || {});
  const [sections, setSections] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const uiOptionsRef = useRef(null);
  const uiRendererIdRef = useRef(null);

  // Generate unique UI renderer ID - matches generateUniqueAttributeId('apptivo-ui-renderer')
  useEffect(() => {
    if (!uiRendererIdRef.current) {
      uiRendererIdRef.current = `apptivo-ui-renderer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  // Initialize UI Renderer - matches the exact initialization sequence from uiRender.js
  useEffect(() => {
    if (!externalUiOptions || initialized) return;

    // Create a deep copy of uiOptions to avoid mutating the original
    const uiOptions = JSON.parse(JSON.stringify(externalUiOptions));
    
    // Set uiRendererId - matches: scope.uiOptions.uiRendererId = uiRendererId
    uiOptions.uiRendererId = uiRendererIdRef.current;
    
    // Convert mode to uppercase to match AngularJS (CREATE, VIEW)
    const normalizedMode = mode.toUpperCase() === 'EDIT' ? 'CREATE' : mode.toUpperCase();
    
    // Initialize UI Renderer - this matches the entire initialization sequence
    try {
      initializeUIRenderer(uiOptions, normalizedMode);
      
      // Store initialized uiOptions in ref
      uiOptionsRef.current = uiOptions;
      
      // Set sections from initialized WEB_LAYOUT
      if (uiOptions.WEB_LAYOUT?.sections) {
        setSections(uiOptions.WEB_LAYOUT.sections);
      }
      
      // Initialize form data from objectIdx
      if (uiOptions.objectIdx) {
        setFormData(uiOptions.objectIdx);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('Error initializing UI Renderer:', error);
    }
  }, [externalUiOptions, mode, initialized]);

  // Initialize form data
  useEffect(() => {
    if (externalFormData) {
      setFormData(externalFormData);
    } else if (uiOptionsRef.current?.objectIdx) {
      setFormData(uiOptionsRef.current.objectIdx);
    }
  }, [externalFormData]);

  // Handle field changes - matches the field change handling in AngularJS
  const handleFieldChange = useCallback((attribute, value, rowIndex = null) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      setAttributeValue(attribute, newData, value, rowIndex);
      
      // Update objectIdx in uiOptions - matches AngularJS behavior
      if (uiOptionsRef.current) {
        uiOptionsRef.current.objectIdx = { ...newData };
        
        // Mark as dirty - matches: scope.uiOptions.objectIdx.isDirtypage = true
        if (uiOptionsRef.current.mode === 'CREATE') {
          uiOptionsRef.current.objectIdx.isDirtypage = true;
        }
      }
      
      // Notify parent component
      if (onFormDataChange) {
        onFormDataChange(newData, attribute, value);
      }
      
      return newData;
    });
  }, [onFormDataChange]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  }, [formData, onSave]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Show loading state during initialization
  if (!initialized) {
    return (
      <div className="text-base-muted-foreground p-4">
        Initializing form...
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="text-base-muted-foreground p-4">
        No sections available to render
      </div>
    );
  }

  // Use initialized uiOptions from ref
  const uiOptions = uiOptionsRef.current || externalUiOptions;

  return (
    <div 
      id={uiRendererIdRef.current}
      className={`ui-renderer ${className}`}
      data-ui-renderer-id={uiRendererIdRef.current}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {sections.map((section, index) => (
          <Section
            key={section.sectionId || section.id || index}
            section={section}
            formData={formData}
            onFieldChange={handleFieldChange}
            mode={mode}
            collapsible={section.collapsible || false}
            defaultCollapsed={section.defaultCollapsed || false}
            configData={uiOptions.configCache || uiOptions.configData}
            uiRendererId={uiRendererIdRef.current}
          />
        ))}

        {mode !== 'view' && (
          <div className="flex justify-end space-x-4 mt-6">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-base-border rounded-md text-base-foreground hover:bg-base-muted"
              >
                Cancel
              </button>
            )}
            {onSave && (
              <button
                type="submit"
                className="px-4 py-2 bg-base-primary text-base-primaryForeground rounded-md hover:bg-base-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === 'create' ? 'Create' : 'Save'}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default UIRenderer;

