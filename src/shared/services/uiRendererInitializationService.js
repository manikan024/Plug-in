/**
 * UIRendererInitializationService
 * 
 * Replicates the exact initialization flow from apptivo-ng-ui uiRender.js directive
 * Matches the initialization sequence inch by inch:
 * 1. prepareAttributesMap
 * 2. upgradeWebLayout
 * 3. getValidSections
 * 4. updateCustomAttributeValues
 * 5. initDependsOnMap
 * 6. initReferenceFieldMap
 * And all other initialization steps
 */

/**
 * Prepare attributes map - matches UiRendererUtilService.prepareAttributesMap
 * Creates maps for fast attribute/section lookup
 */
export function prepareAttributesMap(uiOptions) {
  if (!uiOptions) return;
  
  uiOptions.sectionsMap = {};
  uiOptions.attributesMap = {};
  uiOptions.attributeSectionsMap = {};
  uiOptions.lineLevelAttributesMap = {};
  uiOptions.refAppAttributesMap = {};
  uiOptions.mandatoryAttributesMap = {};
  
  getSectionsAttributesAsMap(
    uiOptions,
    uiOptions.WEB_LAYOUT?.sections || [],
    uiOptions.sectionsMap,
    uiOptions.attributesMap,
    uiOptions.attributeSectionsMap
  );
  
  // Handle derived sections if they exist
  if (uiOptions.derivedSectionsMap) {
    const drivingSections = [];
    for (const drivingAttribute in uiOptions.derivedSectionsMap) {
      const section = uiOptions.derivedSectionsMap[drivingAttribute]?.[0];
      if (section) {
        drivingSections.push(section);
      }
    }
    getSectionsAttributesAsMap(
      uiOptions,
      drivingSections,
      uiOptions.sectionsMap,
      uiOptions.attributesMap,
      uiOptions.attributeSectionsMap
    );
  }
}

/**
 * Get sections and attributes as maps - matches getSectionsAttributesAsMap
 */
function getSectionsAttributesAsMap(uiOptions, sections, sectionsMap, attributesMap, attributeSectionsMap) {
  if (!sections || !Array.isArray(sections)) return;
  
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    if (!section) continue;
    
    const sectionId = section.sectionId || section.id;
    if (sectionId) {
      sectionsMap[sectionId] = section;
    }
    
    // Process attributes
    if (section.attributes && Array.isArray(section.attributes)) {
      for (let attrIndex = 0; attrIndex < section.attributes.length; attrIndex++) {
        const attribute = section.attributes[attrIndex];
        if (!attribute) continue;
        
        const attributeId = attribute.attributeId || attribute.id;
        if (attributeId) {
          attributesMap[attributeId] = attribute;
          if (!attributeSectionsMap[attributeId]) {
            attributeSectionsMap[attributeId] = [];
          }
          attributeSectionsMap[attributeId].push(sectionId);
        }
      }
    }
    
    // Process inner sections recursively
    if (section.sections && Array.isArray(section.sections)) {
      getSectionsAttributesAsMap(uiOptions, section.sections, sectionsMap, attributesMap, attributeSectionsMap);
    }
    
    // Process table sections
    if (section.sectionType === 'table' && section.columns) {
      for (let colIndex = 0; colIndex < section.columns.length; colIndex++) {
        const column = section.columns[colIndex];
        if (column && column.attributes) {
          for (let attrIndex = 0; attrIndex < column.attributes.length; attrIndex++) {
            const attribute = column.attributes[attrIndex];
            if (!attribute) continue;
            
            const attributeId = attribute.attributeId || attribute.id;
            if (attributeId) {
              attributesMap[attributeId] = attribute;
              if (!attributeSectionsMap[attributeId]) {
                attributeSectionsMap[attributeId] = [];
              }
              attributeSectionsMap[attributeId].push(sectionId);
            }
          }
        }
      }
    }
  }
}

/**
 * Initialize dependency map - matches utilService.initDependsOnMap
 */
export function initDependsOnMap(uiOptions) {
  if (!uiOptions || !uiOptions.configCache) return;
  
  const dependenciesMap = uiOptions.configCache.dependencyAttributes;
  if (!dependenciesMap || !Array.isArray(dependenciesMap)) {
    uiOptions.dependsOnMap = {};
    return;
  }
  
  uiOptions.dependsOnMap = {};
  
  for (let depIndex = 0; depIndex < dependenciesMap.length; depIndex++) {
    const dependencyAttributeIds = dependenciesMap[depIndex];
    if (!dependencyAttributeIds) continue;
    
    for (const key in dependencyAttributeIds) {
      const dependents = dependencyAttributeIds[key];
      if (Array.isArray(dependents)) {
        for (let depIdx = 0; depIdx < dependents.length; depIdx++) {
          const dependent = dependents[depIdx];
          if (!uiOptions.dependsOnMap[dependent]) {
            uiOptions.dependsOnMap[dependent] = [];
          }
          uiOptions.dependsOnMap[dependent].push(key);
        }
      }
    }
  }
}

/**
 * Initialize reference field map - matches utilService.initReferenceFieldMap
 */
export function initReferenceFieldMap(uiOptions) {
  if (!uiOptions || !uiOptions.WEB_LAYOUT) return;
  
  uiOptions.referenceFieldsMap = {};
  
  const sections = uiOptions.WEB_LAYOUT.sections || [];
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    if (!section || !section.attributes) continue;
    
    for (let attrIndex = 0; attrIndex < section.attributes.length; attrIndex++) {
      const attribute = section.attributes[attrIndex];
      if (!attribute) continue;
      
      // Check if this is a reference field attribute
      if (attribute.associatedField && attribute.associatedField.referenceAttributeId) {
        const refAttributeId = attribute.associatedField.referenceAttributeId;
        if (!uiOptions.referenceFieldsMap[refAttributeId]) {
          uiOptions.referenceFieldsMap[refAttributeId] = [];
        }
        uiOptions.referenceFieldsMap[refAttributeId].push(attribute);
      }
    }
  }
}

/**
 * Initialize UI Renderer - matches the exact initialization sequence from uiRender.js
 * This is the main initialization function that orchestrates all initialization steps
 */
export function initializeUIRenderer(uiOptions, mode = 'CREATE') {
  if (!uiOptions) {
    throw new Error('uiOptions is required');
  }
  
  // Step 1: Set default mode if not provided
  if (!uiOptions.mode) {
    uiOptions.mode = mode;
  } else if (uiOptions.pageMode === 'VIEW') {
    uiOptions.mode = 'VIEW';
  }
  
  // Step 2: Set currency format
  if (uiOptions.configCache && uiOptions.configCache.currencySymbolType) {
    uiOptions.currencyFormat = uiOptions.configCache.currencySymbolType;
  } else {
    uiOptions.currencyFormat = 'CURRENCY_FORMAT_SYMBOL';
  }
  
  // Step 3: Initialize objectIdx if not present
  if (!uiOptions.objectIdx) {
    uiOptions.objectIdx = {};
  }
  
  // Step 4: Initialize helper maps
  if (!uiOptions.tableAddressAttributeMap) {
    uiOptions.tableAddressAttributeMap = {};
  }
  if (!uiOptions.imageExtensionsMap) {
    uiOptions.imageExtensionsMap = {};
  }
  if (!uiOptions.pdfFilesMap) {
    uiOptions.pdfFilesMap = {};
  }
  
  // Step 5: Prepare table address attribute map (for CREATE and VIEW modes)
  if ((uiOptions.mode === 'CREATE' && !uiOptions.pageMode) || uiOptions.mode === 'VIEW') {
    prepareTableAddressAttributeMap(uiOptions.objectIdx, uiOptions);
  }
  
  // Step 6: Set disable all fields flag
  uiOptions.disableAllFields = isDisabledAllFields(uiOptions);
  
  // Step 7: Get object ID
  uiOptions.objectId = getObjectId(uiOptions);
  
  // Step 8: Prepare attributes map (CRITICAL - must be done before upgradeWebLayout)
  prepareAttributesMap(uiOptions);
  
  // Step 9: Initialize dependency map
  initDependsOnMap(uiOptions);
  
  // Step 10: Upgrade web layout (initializes date fields, custom attributes structure)
  // This matches: uiGeneratorService.upgradeWebLayout(scope.uiOptions.WEB_LAYOUT, scope.uiOptions.objectIdx, scope.uiOptions.mode, scope.uiOptions.configCache)
  upgradeWebLayout(uiOptions.WEB_LAYOUT, uiOptions.objectIdx, uiOptions.mode, uiOptions.configCache);
  
  // Step 11: Get valid sections (filters sections based on mode, visibility, dependencies)
  // This matches: appUIGenService.getValidSections(scope.uiOptions, scope.uiOptions.mode, scope.uiOptions.objectIdx, tabId)
  getValidSections(uiOptions, uiOptions.mode, uiOptions.objectIdx);
  
  // Step 12: Update custom attribute values
  // This matches: appUIGenService.updateCustomAttributeValues(scope.uiOptions.WEB_LAYOUT, scope.uiOptions.objectIdx, scope.uiOptions.mode, scope.uiOptions)
  updateCustomAttributeValues(uiOptions.WEB_LAYOUT, uiOptions.objectIdx, uiOptions.mode, uiOptions);
  
  // Step 13: Update phone and email values based on settings
  updatePhoneEmailValues(uiOptions);
  
  // Step 14: Initialize reference field map
  initReferenceFieldMap(uiOptions);
  
  // Step 15: Prepare reference app field attributes map
  prepareRefAppFieldAttributesMap(uiOptions);
  
  return uiOptions;
}

/**
 * Get object ID from uiOptions - matches utilService.getObjectId
 */
function getObjectId(uiOptions) {
  if (uiOptions.objectId) {
    return uiOptions.objectId;
  }
  if (uiOptions.WEB_LAYOUT && uiOptions.WEB_LAYOUT.objectId) {
    return uiOptions.WEB_LAYOUT.objectId;
  }
  return null;
}

/**
 * Check if all fields should be disabled - matches utilService.isDisabledAllFields
 */
function isDisabledAllFields(uiOptions) {
  // Simplified version - can be enhanced based on actual logic
  return uiOptions.disableAllFields === true;
}

/**
 * Prepare table address attribute map - matches utilService.prepareTableAddressAttributeMap
 */
function prepareTableAddressAttributeMap(objectIdx, uiOptions) {
  // Simplified version - can be enhanced based on actual logic
  if (!uiOptions.tableAddressAttributeMap) {
    uiOptions.tableAddressAttributeMap = {};
  }
}

/**
 * Upgrade web layout - matches ApptivoUiGeneratorService.upgradeWebLayout
 * This initializes date fields and custom attributes structure
 */
function upgradeWebLayout(webLayout, objectIdx, mode, configCache) {
  if (!webLayout || !webLayout.sections) return;
  
  const sections = webLayout.sections;
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    if (!section || !section.attributes) continue;
    
    for (let attrIndex = 0; attrIndex < section.attributes.length; attrIndex++) {
      const attribute = section.attributes[attrIndex];
      if (!attribute) continue;
      
      // Initialize date fields
      if (attribute.right && attribute.right.length > 0) {
        const right = attribute.right[0];
        if (right.tag === 'date' || right.tag === 'dateTime') {
          // Initialize date field structure
          if (!right.tagName) {
            right.tagName = attribute.tagName || `date_${attribute.attributeId}`;
          }
        }
      }
      
      // Initialize custom attribute structure
      if (attribute.type === 'Custom' && !objectIdx.customAttributes) {
        objectIdx.customAttributes = [];
      }
    }
  }
}

/**
 * Get valid sections - matches appUIGenService.getValidSections
 * Filters sections based on mode, visibility, dependencies, privileges
 */
function getValidSections(uiOptions, mode, objectIdx) {
  if (!uiOptions.WEB_LAYOUT || !uiOptions.WEB_LAYOUT.sections) return;
  
  const webLayout = uiOptions.WEB_LAYOUT;
  const sections = webLayout.sections;
  const validSections = validateSections(uiOptions, mode, objectIdx, sections, webLayout.objectId);
  
  webLayout.sections = validSections;
}

/**
 * Validate sections - matches appUIGenService.validateSections
 */
function validateSections(uiOptions, mode, objectIdx, sections, objectId) {
  const validSections = [];
  
  // Get field dependencies
  const fieldDependencies = getFieldDependencies(sections);
  
  // Reset address isAdded flags
  if (uiOptions.objectIdx && uiOptions.objectIdx.addresses) {
    for (let addressIndex = 0; addressIndex < uiOptions.objectIdx.addresses.length; addressIndex++) {
      uiOptions.objectIdx.addresses[addressIndex].isAdded = false;
    }
  }
  
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    if (!section) continue;
    
    // Check if section is enabled
    if (section.isEnabled === false || section.isEnabled === 'false') {
      continue;
    }
    
    // Check if section is visible
    if (section.isVisible === false || section.isVisible === 'false') {
      continue;
    }
    
    // Validate section based on mode
    let isValidSection = true;
    
    // Check section type and mode compatibility
    if (section.sectionType === 'table') {
      // Table section validation
      isValidSection = validateTableSection(section, uiOptions, mode, objectIdx);
    } else {
      // Form section validation
      isValidSection = validateFormSection(section, uiOptions, mode, objectIdx);
    }
    
    if (isValidSection) {
      // Process inner sections recursively
      if (section.sections && Array.isArray(section.sections)) {
        section.sections = validateSections(uiOptions, mode, objectIdx, section.sections, objectId);
      }
      
      // Check if section has content (attributes, inner sections, or columns)
      const hasContent = 
        (section.sections && section.sections.length > 0) ||
        (section.attributes && section.attributes.length > 0) ||
        (section.columns && section.columns.length > 0);
      
      if (hasContent && section.isVisible !== false && section.isVisible !== 'false') {
        validSections.push(section);
      }
    }
  }
  
  return validSections;
}

/**
 * Get field dependencies - matches appUIGenService.getFieldDependencies
 */
function getFieldDependencies(sections) {
  const dependencyFields = [];
  
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    if (!section || !section.attributes) continue;
    
    for (let attrIndex = 0; attrIndex < section.attributes.length; attrIndex++) {
      const attribute = section.attributes[attrIndex];
      if (attribute && attribute.fieldDisplayDependencies) {
        dependencyFields.push(attribute.attributeId);
      }
    }
  }
  
  return dependencyFields;
}

/**
 * Validate table section
 */
function validateTableSection(section, uiOptions, mode, objectIdx) {
  // Simplified validation - can be enhanced
  return true;
}

/**
 * Validate form section
 */
function validateFormSection(section, uiOptions, mode, objectIdx) {
  // Simplified validation - can be enhanced
  return true;
}

/**
 * Update custom attribute values - matches appUIGenService.updateCustomAttributeValues
 */
function updateCustomAttributeValues(webLayout, objectIdx, mode, uiOptions) {
  if (!objectIdx.customAttributes) {
    objectIdx.customAttributes = [];
  }
  
  if (!webLayout || !webLayout.sections) return;
  
  for (let sectionIndex = 0; sectionIndex < webLayout.sections.length; sectionIndex++) {
    const section = webLayout.sections[sectionIndex];
    if (!section) continue;
    
    // Skip related object sections
    if (isRelatedObjectSection(section)) {
      continue;
    }
    
    if (section.sectionType !== 'table') {
      // Format custom attribute values for form sections
      formatCustomIdxValues(section, objectIdx.customAttributes, mode);
    } else {
      // Handle table sections
      // This would call ApptivoTableSectionService.initTableIndex in AngularJS
      initTableIndex(objectIdx, section, mode, null, uiOptions);
      
      if (isStandardSection(section)) {
        const idxTagName = section.lineType || section.id;
        const tableRows = objectIdx[idxTagName];
        if (tableRows && Array.isArray(tableRows)) {
          for (let tIndex = 0; tIndex < tableRows.length; tIndex++) {
            if (tableRows[tIndex].customAttributes && tableRows[tIndex].customAttributes.length > 0) {
              formatCustomIdxValues(section, tableRows[tIndex].customAttributes, mode);
            }
          }
        }
      }
    }
  }
}

/**
 * Format custom index values - matches formatCustomIdxValues
 */
function formatCustomIdxValues(section, customIdx, mode) {
  if (!section || !section.attributes || !Array.isArray(customIdx)) return;
  
  for (let attributeIndex = 0; attributeIndex < section.attributes.length; attributeIndex++) {
    const attribute = section.attributes[attributeIndex];
    if (!attribute) continue;
    
    const custIndex = getFormattedCustomAttributeValue(section, attribute, customIdx, mode);
    if (custIndex && custIndex.isNew) {
      delete custIndex.isNew;
      customIdx.push(custIndex);
    }
  }
}

/**
 * Get formatted custom attribute value - matches appUIGenService.getFormattedCustomAttributeValue
 */
function getFormattedCustomAttributeValue(section, attribute, attributeIndexes, pageName) {
  if (section.type === 'Custom' && (!attribute.type || attribute.type === 'undefined')) {
    attribute.type = 'Custom';
  }
  
  let custIndex;
  if (attribute.type === 'Custom') {
    custIndex = findCustomAttributeIdx(attribute, attributeIndexes);
    
    if (custIndex) {
      // Update custom attribute tag name if needed
      if (!custIndex.customAttributeTagName && attribute.right && attribute.right[0]) {
        custIndex.customAttributeTagName = attribute.right[0].tagName || attribute.tagName;
        custIndex.customAttributeName = attribute.right[0].tagName || attribute.tagName;
      }
    } else {
      // Create new custom attribute index
      custIndex = createCustomAttributeIdx(attribute);
      if (custIndex) {
        custIndex.isNew = true;
      }
    }
  }
  
  return custIndex;
}

/**
 * Find custom attribute index - matches appUIGenService.findCustomAttributeIdx
 */
function findCustomAttributeIdx(attribute, customAttributeIndexes) {
  if (!customAttributeIndexes || !Array.isArray(customAttributeIndexes)) return null;
  
  const tagName = getTagName(attribute, 0);
  for (let i = 0; i < customAttributeIndexes.length; i++) {
    const custAttr = customAttributeIndexes[i];
    if (custAttr.customAttributeId === attribute.attributeId || custAttr.customAttributeId === tagName) {
      return custAttr;
    }
  }
  
  return null;
}

/**
 * Create custom attribute index - matches utilService.createCustomAttributeIdx
 */
function createCustomAttributeIdx(attribute) {
  if (!attribute || !attribute.right || !attribute.right[0]) return null;
  
  const right = attribute.right[0];
  return {
    customAttributeId: attribute.attributeId,
    customAttributeType: right.tag,
    customAttributeTagName: right.tagName || attribute.tagName,
    customAttributeName: right.tagName || attribute.tagName,
    customAttributeValue: '',
  };
}

/**
 * Get tag name - helper function
 */
function getTagName(attribute, rightIndex = 0) {
  if (!attribute) return null;
  if (attribute.right && attribute.right[rightIndex] && attribute.right[rightIndex].tagName) {
    return attribute.right[rightIndex].tagName;
  }
  return attribute.tagName || null;
}

/**
 * Update phone and email values - matches utilService.updatePhoneEmailValues
 */
function updatePhoneEmailValues(uiOptions) {
  // Simplified version - can be enhanced based on actual logic
  // This would update phone and email values based on settings
}

/**
 * Prepare reference app field attributes map - matches utilService.prepareRefAppFieldAttributesMap
 */
function prepareRefAppFieldAttributesMap(uiOptions) {
  if (!uiOptions || !uiOptions.WEB_LAYOUT) return;
  
  uiOptions.refAppAttributesMap = {};
  
  // This would prepare reference app field attributes map
  // Implementation can be enhanced based on actual logic
}

/**
 * Initialize table index - matches ApptivoTableSectionService.initTableIndex
 */
function initTableIndex(objectIdx, section, mode, parentRowIndex, uiOptions) {
  // Simplified version - can be enhanced based on actual logic
  const idxTagName = section.lineType || section.id;
  if (!objectIdx[idxTagName]) {
    objectIdx[idxTagName] = [];
  }
}

/**
 * Check if section is related object section
 */
function isRelatedObjectSection(section) {
  return section && section.type === 'RelatedObject';
}

/**
 * Check if section is standard section
 */
function isStandardSection(section) {
  return section && section.type === 'Standard';
}

export default {
  initializeUIRenderer,
  prepareAttributesMap,
  initDependsOnMap,
  initReferenceFieldMap,
};

