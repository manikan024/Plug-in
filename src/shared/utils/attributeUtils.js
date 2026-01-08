/**
 * Comprehensive utility functions for working with attributes
 * Similar to UiRendererUtilService in AngularJS app-ui-renderer
 */

/**
 * Get attribute value from form data
 */
export function getAttributeValue(attribute, formData, rowIndex = null) {
  if (!attribute || !formData) {
    return null;
  }

  const tagName = attribute.tagName || attribute.right?.[0]?.tagName;
  if (!tagName) {
    return null;
  }

  // Handle table section attributes
  if (rowIndex !== null && attribute.isTableAttribute) {
    const lineType = attribute.lineType;
    if (lineType && formData[lineType] && formData[lineType][rowIndex]) {
      return formData[lineType][rowIndex][tagName];
    }
  }

  return formData[tagName];
}

/**
 * Set attribute value in form data
 */
export function setAttributeValue(attribute, formData, value, rowIndex = null) {
  if (!attribute || !formData) {
    return formData;
  }

  const tagName = attribute.tagName || attribute.right?.[0]?.tagName;
  if (!tagName) {
    return formData;
  }

  // Handle table section attributes
  if (rowIndex !== null && attribute.isTableAttribute) {
    const lineType = attribute.lineType;
    if (lineType) {
      if (!formData[lineType]) {
        formData[lineType] = [];
      }
      if (!formData[lineType][rowIndex]) {
        formData[lineType][rowIndex] = {};
      }
      formData[lineType][rowIndex][tagName] = value;
    }
  } else {
    formData[tagName] = value;
  }

  return formData;
}

/**
 * Check if attribute is mandatory
 */
export function isMandatory(attribute) {
  return attribute?.isMandatory === true || attribute?.isMandatory === 'true';
}

/**
 * Check if attribute is disabled
 */
export function isDisabled(attribute) {
  return attribute?.disableField === true || attribute?.disableField === 'true';
}

/**
 * Check if attribute/section is enabled
 */
export function isEnabled(object) {
  return object && object.isEnabled !== false && object.isEnabled !== "false";
}

/**
 * Get attribute label
 */
export function getAttributeLabel(attribute) {
  return attribute?.label?.modifiedLabel || attribute?.label?.name || attribute?.attributeName || '';
}

/**
 * Get attribute ID
 */
export function getAttributeId(attribute) {
  return attribute?.attributeId || attribute?.id || '';
}

/**
 * Get attribute tag name
 */
export function getTagName(attribute, rightIndex = 0) {
  if (attribute?.right && attribute.right[rightIndex]) {
    return attribute.right[rightIndex].tagName;
  }
  return attribute?.tagName;
}

/**
 * Get attribute tag ID
 */
export function getTagId(attribute, rightIndex = 0) {
  if (attribute?.right && attribute.right[rightIndex]) {
    return attribute.right[rightIndex].tagId;
  }
  return attribute?.tagId;
}

/**
 * Get attribute tag
 */
export function getTag(attribute, rightIndex = 0) {
  if (attribute?.right && attribute.right[rightIndex]) {
    return attribute.right[rightIndex].tag;
  }
  return attribute?.attributeTag || attribute?.tag;
}

/**
 * Check if attribute is visible based on visibility rules
 */
export function isAttributeVisible(attribute, formData, visibilityRules = {}) {
  if (!attribute) {
    return false;
  }

  // Check visibility dependency rules
  const attributeId = getAttributeId(attribute);
  const rule = visibilityRules[attributeId];
  
  if (!rule) {
    return true; // Visible by default if no rule
  }

  // Evaluate visibility condition
  if (rule.dependsOn) {
    const dependentValue = getAttributeValue(rule.dependsOn, formData);
    return rule.condition ? rule.condition(dependentValue) : !!dependentValue;
  }

  return true;
}

/**
 * Get valid sections based on mode and configuration
 */
export function getValidSections(sections, mode = 'create', config = {}) {
  if (!sections || !Array.isArray(sections)) {
    return [];
  }

  return sections.filter(section => {
    // Check if section should be visible in current mode
    if (section.mode && !section.mode.includes(mode)) {
      return false;
    }

    // Check section visibility rules
    if (section.visibilityRule) {
      // Implement visibility logic here
      return true;
    }

    return true;
  });
}

/**
 * Get attributes from a section
 */
export function getSectionAttributes(section) {
  if (!section) {
    return [];
  }

  return section.attributes || [];
}

/**
 * Check if section is a table section
 */
export function isTableSection(section) {
  return section?.sectionType === 'table' || section?.lineType !== undefined;
}

/**
 * Check if section is a form section
 */
export function isFormSection(section) {
  return section && (section.sectionType === '' || section.sectionType === undefined || section.sectionType === 'form-grid');
}

/**
 * Check if section is standard
 */
export function isStandardSection(section) {
  return section && section.type === 'Standard';
}

/**
 * Check if section is custom
 */
export function isCustomSection(section) {
  return section && (!section.type || section.type === 'Custom');
}

// ========== Attribute Type Checks ==========

/**
 * Check if attribute is a checkbox
 */
export function isCheckboxAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'check' || tag === 'checkbox' || 
         (attribute?.right?.[0]?.tag === 'checkbox' || attribute?.right?.[0]?.tag === 'check');
}

/**
 * Check if attribute is a radio button
 */
export function isRadioAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'radio' || attribute?.right?.[0]?.tag === 'radio';
}

/**
 * Check if attribute is a select field
 */
export function isSelectAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'select' || attribute?.right?.[0]?.tag === 'select';
}

/**
 * Check if attribute is a number field
 */
export function isNumberAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'number' || attribute?.right?.[0]?.tag === 'number';
}

/**
 * Check if attribute is a currency field
 */
export function isCurrencyAttribute(attribute) {
  const tag = getTag(attribute);
  const displayType = attribute?.displayType?.typeName;
  return tag === 'currency' || attribute?.right?.[0]?.tag === 'currency' || displayType === 'Currency';
}

/**
 * Check if attribute is a date field
 */
export function isDateAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'date' || attribute?.right?.[0]?.tag === 'date';
}

/**
 * Check if attribute is a dateTime field
 */
export function isDateTimeAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'dateTime' || attribute?.right?.[0]?.tag === 'dateTime';
}

/**
 * Check if attribute is a textarea
 */
export function isTextareaAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'textarea' || tag === 'simpleTextarea' || 
         attribute?.right?.[0]?.tag === 'textarea' || attribute?.right?.[0]?.tag === 'simpleTextarea';
}

/**
 * Check if attribute is an address field
 */
export function isAddressAttribute(attribute) {
  return attribute?.addressList || attribute?.isAddressAttribute;
}

/**
 * Check if attribute is a reference field
 */
export function isReferenceAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'reference' || tag === 'finkey' || tag === 'account' || 
         attribute?.referenceObject || attribute?.associatedField;
}

/**
 * Check if attribute is a formula field
 */
export function isFormulaAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'formula' || attribute?.formulaType || attribute?.formula;
}

/**
 * Check if attribute is a phone/email field
 */
export function isPhoneEmailAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'phoneEmail' || attribute?.phoneNumbers || attribute?.emailAddresses;
}

/**
 * Check if attribute is a phone field
 */
export function isPhoneAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'phone' || tag === 'fax' || attribute?.phoneType;
}

/**
 * Check if attribute is an email field
 */
export function isEmailAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'email' || attribute?.emailAddress;
}

/**
 * Check if attribute is a duration field
 */
export function isDurationAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'duration' || attribute?.right?.[0]?.tag === 'duration';
}

/**
 * Check if attribute is a salutation field
 */
export function isSalutationAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'salutation' || attribute?.right?.[0]?.tag === 'salutation';
}

/**
 * Check if attribute is a toggle field
 */
export function isToggleAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'toggle' || tag === 'on_off';
}

/**
 * Check if attribute is a tags field
 */
export function isTagsAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'select_search' || tag === 'tags';
}

/**
 * Check if attribute is a file upload field
 */
export function isFileUploadAttribute(attribute) {
  const tag = getTag(attribute);
  return tag === 'fileUpload' || tag === 'upload' || tag === 'imageUpload';
}

/**
 * Check if attribute is a custom attribute
 */
export function isCustomAttribute(attribute) {
  return attribute?.type === 'Custom' || (!attribute?.type && attribute?.customAttributeId);
}

/**
 * Check if attribute is a standard attribute
 */
export function isStandardAttribute(attribute) {
  return attribute?.type === 'Standard';
}

/**
 * Check if attribute is a combined attribute (multiple right elements)
 */
export function isCombinedAttribute(attribute) {
  return !isCheckboxAttribute(attribute) && !isRadioAttribute(attribute) && 
         attribute?.right && attribute.right.length > 1;
}

/**
 * Check if attribute is numeric (number, currency, formula)
 */
export function isNumericAttribute(attribute) {
  const numericTypes = ['currency', 'number', 'formula'];
  const tag = getTag(attribute);
  return numericTypes.includes(tag) || numericTypes.includes(attribute?.right?.[0]?.tag);
}

/**
 * Check if attribute is a string attribute
 */
export function isStringAttribute(attribute) {
  const stringTypes = ['input', 'textarea', 'date', 'dateTime', 'time', 'formula'];
  const tag = getTag(attribute);
  return stringTypes.includes(tag) || stringTypes.includes(attribute?.right?.[0]?.tag);
}

// ========== Validation Functions ==========

/**
 * Validate attribute value
 */
export function validateAttribute(attribute, value, formData = {}) {
  const errors = [];

  // Check mandatory
  if (isMandatory(attribute)) {
    if (value === null || value === undefined || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      errors.push(`${getAttributeLabel(attribute)} is required`);
    }
  }

  // Check min/max for numbers
  if (isNumberAttribute(attribute) || isCurrencyAttribute(attribute)) {
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (!isNaN(numValue)) {
      if (attribute.min !== undefined && numValue < attribute.min) {
        errors.push(`${getAttributeLabel(attribute)} must be at least ${attribute.min}`);
      }
      if (attribute.max !== undefined && numValue > attribute.max) {
        errors.push(`${getAttributeLabel(attribute)} must be at most ${attribute.max}`);
      }
    }
  }

  // Check max length for strings
  if (isStringAttribute(attribute) && typeof value === 'string') {
    if (attribute.maxLength && value.length > attribute.maxLength) {
      errors.push(`${getAttributeLabel(attribute)} must be at most ${attribute.maxLength} characters`);
    }
    if (attribute.minLength && value.length < attribute.minLength) {
      errors.push(`${getAttributeLabel(attribute)} must be at least ${attribute.minLength} characters`);
    }
  }

  // Check email format
  if (isEmailAttribute(attribute) && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push(`${getAttributeLabel(attribute)} must be a valid email address`);
    }
  }

  // Check URL format for links
  if (getTag(attribute) === 'link' && value) {
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`);
    } catch {
      errors.push(`${getAttributeLabel(attribute)} must be a valid URL`);
    }
  }

  return errors;
}

/**
 * Validate all mandatory fields in form data
 */
export function validateMandatoryFields(sections, formData) {
  const errors = {};
  
  sections.forEach(section => {
    getSectionAttributes(section).forEach(attribute => {
      if (isMandatory(attribute)) {
        const value = getAttributeValue(attribute, formData);
        const attributeErrors = validateAttribute(attribute, value, formData);
        if (attributeErrors.length > 0) {
          errors[getAttributeId(attribute)] = attributeErrors;
        }
      }
    });
  });

  return errors;
}

// ========== Dependency Functions ==========

/**
 * Get attributes that depend on this attribute
 */
export function getDependentAttributes(attributeId, dependencyMap = {}) {
  return dependencyMap[attributeId] || [];
}

/**
 * Check if attribute has dependencies
 */
export function hasDependencies(attribute, dependencyMap = {}) {
  const attributeId = getAttributeId(attribute);
  const dependents = getDependentAttributes(attributeId, dependencyMap);
  return dependents.length > 0;
}

/**
 * Update dependent attributes based on value change
 */
export function updateDependentAttributes(attribute, value, formData, dependencyMap = {}) {
  const attributeId = getAttributeId(attribute);
  const dependents = getDependentAttributes(attributeId, dependencyMap);
  
  dependents.forEach(dependent => {
    const dependentAttribute = dependent.attribute;
    const rule = dependent.rule;
    
    // Check visibility dependency
    if (rule.type === 'visibility') {
      const shouldBeVisible = rule.condition ? rule.condition(value) : !!value;
      // Update visibility in formData or attribute metadata
      if (dependentAttribute) {
        dependentAttribute.isVisible = shouldBeVisible;
      }
    }
    
    // Check value dependency
    if (rule.type === 'value') {
      const newValue = rule.calculate ? rule.calculate(value, formData) : rule.defaultValue;
      setAttributeValue(dependentAttribute, formData, newValue);
    }
  });
  
  return formData;
}

// ========== Helper Functions ==========

/**
 * Get attribute by ID from sections
 */
export function getAttributeById(sections, attributeId) {
  if (!sections || !Array.isArray(sections)) {
    return null;
  }

  for (const section of sections) {
    const attributes = getSectionAttributes(section);
    const found = attributes.find(attr => getAttributeId(attr) === attributeId);
    if (found) {
      return found;
    }
    
    // Check nested sections
    if (section.sections) {
      const nested = getAttributeById(section.sections, attributeId);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

/**
 * Get attributes by tag from sections
 */
export function getAttributesByTag(sections, tag) {
  const results = [];
  
  if (!sections || !Array.isArray(sections)) {
    return results;
  }

  sections.forEach(section => {
    getSectionAttributes(section).forEach(attribute => {
      if (getTag(attribute) === tag) {
        results.push(attribute);
      }
    });
    
    // Check nested sections
    if (section.sections) {
      results.push(...getAttributesByTag(section.sections, tag));
    }
  });

  return results;
}

/**
 * Format number value
 */
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined) return '';
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) return value;
  return numValue.toFixed(decimals);
}

/**
 * Format currency value
 */
export function formatCurrency(value, currencyCode = 'USD') {
  if (value === null || value === undefined) return '';
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) return value;
  
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };
  
  const symbol = currencySymbols[currencyCode] || currencyCode;
  return `${symbol}${numValue.toFixed(2)}`;
}

/**
 * Format date value
 */
export function formatDate(value, format = 'short') {
  if (!value) return '';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return value;
    
    if (format === 'short') {
      return date.toLocaleDateString();
    } else if (format === 'long') {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return date.toISOString().split('T')[0];
  } catch {
    return value;
  }
}

/**
 * Check if value is undefined or null
 */
export function isUndefined(value) {
  return value === undefined || value === null;
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key]);
  });
  
  return cloned;
}
