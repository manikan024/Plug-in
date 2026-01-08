/**
 * Field Utilities - Validation and transformation helpers
 * Matches React-plugin fieldUtils pattern
 */

/**
 * Apply case conversion to text
 */
export function applyCaseConversion(text, type) {
  if (!text || !type) return text;
  
  switch (type) {
    case 'UPPERCASE':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'Title Case':
    case 'TitleCase':
      return text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    default:
      return text;
  }
}

/**
 * Validate data type and filter invalid characters
 */
export function validateDataType(value, type) {
  if (!value || !type) return value;
  
  switch (type) {
    case 'NUMBER':
    case 'Number':
      // Only allow digits, decimal point, and minus sign
      return value.replace(/[^0-9.-]/g, '');
    case 'ALPHABET':
    case 'Alphabet':
      // Only allow letters and spaces
      return value.replace(/[^a-zA-Z\s]/g, '');
    case 'ALPHANUMERIC':
    case 'Alphanumeric':
      // Only allow letters, numbers, and spaces
      return value.replace(/[^a-zA-Z0-9\s]/g, '');
    default:
      return value;
  }
}

/**
 * Validate key press based on data type rule
 */
export function validateKeyPress(e, dataTypeRule) {
  if (!dataTypeRule?.isEnabled || !dataTypeRule?.type) return;
  
  const key = e.key;
  const type = dataTypeRule.type;
  
  // Allow control keys (backspace, delete, tab, etc.)
  if (key.length > 1) return;
  
  switch (type) {
    case 'NUMBER':
    case 'Number':
      // Only allow digits, decimal point, and minus sign
      if (!/[\d.-]/.test(key)) {
        e.preventDefault();
      }
      break;
    case 'ALPHABET':
    case 'Alphabet':
      // Only allow letters and spaces
      if (!/[a-zA-Z\s]/.test(key)) {
        e.preventDefault();
      }
      break;
    case 'ALPHANUMERIC':
    case 'Alphanumeric':
      // Only allow letters, numbers, and spaces
      if (!/[a-zA-Z0-9\s]/.test(key)) {
        e.preventDefault();
      }
      break;
    default:
      // Allow all characters
      break;
  }
}

