import React from 'react';
import fieldRendererService from '../services/fieldRendererService';
import { getAttributeLabel, getAttributeId, isMandatory } from '../utils/attributeUtils';
import FieldLabel from './FieldLabel';

/**
 * AttributeContainer - Wraps a field with label, validation, and layout
 * Enhanced with React-plugin patterns and apptivo-ng-ui logic
 */
function AttributeContainer({
  attribute,
  value,
  onChange,
  mode = 'create',
  rowIndex = null,
  className = '',
  showLabel = true,
  ...props
}) {
  const attributeId = getAttributeId(attribute);
  const label = getAttributeLabel(attribute);
  const isRequired = isMandatory(attribute);
  const isHelpTextEnabled = attribute?.help?.isEnabled === true;
  const helpMessage = attribute?.help?.helpMessage || attribute?.help?.message || '';

  // Render the field using the field renderer service
  const fieldElement = fieldRendererService.renderField(
    attribute,
    value,
    onChange,
    mode,
    {
      ...props,
      rowIndex,
    }
  );

  if (!fieldElement) {
    return null;
  }

  const isVisible = attribute.isVisible !== false;
  const isDisabled = attribute.isDisabled === true || attribute.disableField === true;
  const isDependencyField = attribute.isDependencyField === true;
  const showDependency = attribute.showDependency !== false;

  if (!isVisible || (isDependencyField && !showDependency)) {
    return null;
  }

  return (
    <div className={`attribute-container mb-4 ${className}`}>
      {showLabel && (
        <FieldLabel
          id={`field-${attributeId}`}
          label={label}
          required={isRequired && mode !== 'view'}
          showLabel={!!label}
          isHelpTextEnabled={isHelpTextEnabled}
          helpMessage={helpMessage}
        />
      )}
      <div 
        id={`field-container-${attributeId}`}
        className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      >
        {fieldElement}
      </div>
    </div>
  );
}

export default AttributeContainer;

