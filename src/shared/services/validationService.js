import { validateAttribute, validateMandatoryFields, isMandatory, getAttributeValue } from '../utils/attributeUtils';

/**
 * Validation Service - Handles form validation
 */
class ValidationService {
  /**
   * Validate a single attribute
   */
  validateAttribute(attribute, value, formData = {}) {
    return validateAttribute(attribute, value, formData);
  }

  /**
   * Validate all fields in sections
   */
  validateForm(sections, formData) {
    const errors = validateMandatoryFields(sections, formData);
    
    // Validate all attributes
    sections.forEach(section => {
      section.attributes?.forEach(attribute => {
        const value = getAttributeValue(attribute, formData);
        const attributeErrors = validateAttribute(attribute, value, formData);
        if (attributeErrors.length > 0) {
          const attributeId = attribute.attributeId || attribute.id;
          errors[attributeId] = attributeErrors;
        }
      });
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Check if form has errors
   */
  hasErrors(validationResult) {
    return !validationResult.isValid;
  }

  /**
   * Get error message for an attribute
   */
  getErrorMessage(attributeId, validationResult) {
    const errors = validationResult.errors[attributeId];
    return errors && errors.length > 0 ? errors[0] : null;
  }
}

export default new ValidationService();

