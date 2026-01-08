import BaseApiService from './base-api-service';
import { API_CONSTANTS } from './api-constants';
import { OBJECT_IDS } from './object-constants';

/**
 * ContactSaveApiService - Handles contact save operations
 * Simplified version matching React-plugin pattern
 */
class ContactSaveApiService extends BaseApiService {
  constructor() {
    super('contacts');
    this.objectId = OBJECT_IDS.CONTACTS;
  }

  /**
   * Save contact data
   * @param {Object} formData - Form data from UIRenderer
   * @param {Object} configData - Config data
   * @returns {Promise<Object>} Save response
   */
  async saveContact(formData, configData = {}) {
    try {
      // Build contact data payload
      const contactData = this.buildContactData(formData, configData);

      const params = {
        objectId: this.objectId,
      };

      // Send as form data
      const data = await this.post(
        API_CONSTANTS.Contacts.SAVE,
        { contactData: JSON.stringify(contactData) },
        params,
        { contentType: 'form' }
      );

      console.log('Contact saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  }

  /**
   * Build contact data from form data
   * Simplified version - can be enhanced later
   */
  buildContactData(formData, configData) {
    const config = configData?.configData || configData || {};

    return {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      title: formData.title || '',
      jobTitle: formData.jobTitle || '',
      description: formData.description || '',
      phoneNumbers: formData.phoneNumbers || [],
      emailAddresses: formData.emailAddresses || [],
      addresses: formData.addresses || [],
      labels: formData.labels || [],
      customAttributes: this.buildCustomAttributes(formData, configData),
      // Add more fields as needed
    };
  }

  /**
   * Build custom attributes from form data
   */
  buildCustomAttributes(formData, configData) {
    const customAttributes = [];
    
    // Extract custom attributes from formData
    // This is a simplified version - can be enhanced based on metadata
    Object.keys(formData).forEach((key) => {
      // Skip standard fields
      if (['firstName', 'lastName', 'title', 'jobTitle', 'description', 
           'phoneNumbers', 'emailAddresses', 'addresses', 'labels'].includes(key)) {
        return;
      }

      const value = formData[key];
      if (value !== undefined && value !== null && value !== '') {
        customAttributes.push({
          customAttributeTagName: key,
          customAttributeName: key,
          customAttributeValue: value,
          [key]: value,
        });
      }
    });

    return customAttributes;
  }
}

const contactSaveApiService = new ContactSaveApiService();

export const saveContact = (formData, configData) =>
  contactSaveApiService.saveContact(formData, configData);

export default contactSaveApiService;

