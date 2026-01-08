/**
 * Utility to convert configData to uiOptions format for the renderer
 */
export function convertConfigDataToUiOptions(configData) {
  if (!configData) {
    return null;
  }

  // Parse webLayout if it's a string
  let webLayout = configData.webLayout;
  if (typeof webLayout === 'string') {
    try {
      webLayout = JSON.parse(webLayout);
    } catch (e) {
      console.error('Error parsing webLayout:', e);
      return null;
    }
  }

  if (!webLayout || !webLayout.sections) {
    return null;
  }

  // Build uiOptions structure
  const uiOptions = {
    WEB_LAYOUT: {
      sections: webLayout.sections || [],
      objectId: webLayout.objectId,
      objectName: webLayout.objectName,
    },
    objectIdx: configData.objectIdx || {},
    configData: configData,
    // Add reference data from configData
    phoneTypes: configData.phoneTypes || [],
    emailTypes: configData.emailTypes || [],
    addressTypes: configData.addressTypes || [],
    statuses: configData.statuses || [],
    priorities: configData.priorities || [],
    types: configData.types || [],
    // Add any other config data that might be needed
    attributesMap: buildAttributesMap(webLayout.sections),
    sectionsMap: buildSectionsMap(webLayout.sections),
    attributeSectionsMap: buildAttributeSectionsMap(webLayout.sections),
  };

  return uiOptions;
}

/**
 * Build attributes map for quick lookup
 */
function buildAttributesMap(sections) {
  const map = {};
  
  function processSection(section) {
    if (section.attributes && Array.isArray(section.attributes)) {
      section.attributes.forEach(attr => {
        if (attr.attributeId) {
          map[attr.attributeId] = attr;
        }
      });
    }
    
    // Process nested sections
    if (section.sections && Array.isArray(section.sections)) {
      section.sections.forEach(processSection);
    }
  }
  
  sections.forEach(processSection);
  return map;
}

/**
 * Build sections map for quick lookup
 */
function buildSectionsMap(sections) {
  const map = {};
  
  function processSection(section, index) {
    if (section.id || section.sectionId) {
      const sectionId = section.id || section.sectionId;
      map[sectionId] = section;
      map[sectionId].index = index;
    }
    
    // Process nested sections
    if (section.sections && Array.isArray(section.sections)) {
      section.sections.forEach((subSection, subIndex) => {
        processSection(subSection, subIndex);
      });
    }
  }
  
  sections.forEach((section, index) => {
    processSection(section, index);
  });
  
  return map;
}

/**
 * Build attribute to section mapping
 */
function buildAttributeSectionsMap(sections) {
  const map = {};
  
  function processSection(section) {
    if (section.attributes && Array.isArray(section.attributes)) {
      const sectionId = section.id || section.sectionId;
      section.attributes.forEach(attr => {
        if (attr.attributeId) {
          map[attr.attributeId] = sectionId;
        }
      });
    }
    
    // Process nested sections
    if (section.sections && Array.isArray(section.sections)) {
      section.sections.forEach(processSection);
    }
  }
  
  sections.forEach(processSection);
  return map;
}

/**
 * Get options for an attribute from configData
 */
export function getAttributeOptions(attribute, configData) {
  if (!attribute || !configData) {
    return [];
  }

  // Check if attribute has options defined
  if (attribute.options && Array.isArray(attribute.options)) {
    return attribute.options;
  }

  // Check if attribute references a configData list
  const attributeId = attribute.attributeId || '';
  
  // Map common attribute IDs to configData properties
  if (attributeId.includes('status') || attributeId.includes('Status')) {
    return (configData.statuses || []).map(s => ({
      id: s.statusId || s.id,
      name: s.statusName || s.name,
      code: s.statusCode || s.code,
    }));
  }
  
  if (attributeId.includes('priority') || attributeId.includes('Priority')) {
    return (configData.priorities || []).map(p => ({
      id: p.id,
      name: p.name,
      code: p.code,
    }));
  }
  
  if (attributeId.includes('type') || attributeId.includes('Type')) {
    return (configData.types || []).map(t => ({
      id: t.typeId || t.id,
      name: t.typeName || t.name,
      code: t.typeCode || t.code,
    }));
  }

  // Check right[0].options
  if (attribute.right && attribute.right[0] && attribute.right[0].options) {
    return attribute.right[0].options;
  }

  return [];
}

