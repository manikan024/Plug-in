import BaseApiService from './base-api-service';
import { API_CONSTANTS } from './api-constants';
import { OBJECT_IDS } from './object-constants';

/**
 * ConfigApiService - Handles config data fetching
 * Matches React-plugin Sidebar pattern
 */
class ConfigApiService extends BaseApiService {
  constructor() {
    super('common');
  }

  /**
   * Fetch config data for an entity
   * @param {number} objectId - Object ID (e.g., OBJECT_IDS.CONTACTS)
   * @returns {Promise<Object>} Config data
   */
  async getConfigData(objectId) {
    try {
      let endpoint = '';
      let params = {};

      // Determine endpoint based on objectId
      switch (objectId) {
        case OBJECT_IDS.CONTACTS:
          endpoint = `${this.baseUrl}/dao/v6/contacts?a=getConfigData`;
          break;
        case OBJECT_IDS.CUSTOMERS:
          endpoint = `${this.baseUrl}/dao/v6/customers?a=getConfigData`;
          break;
        case OBJECT_IDS.TICKETS:
          endpoint = `${this.baseUrl}/dao/v6/cases?a=getConfigData`;
          break;
        default:
          endpoint = `${this.baseUrl}/dao/v6/common?a=getConfigData`;
          params.objectId = objectId;
      }

      const data = await this.get(endpoint, params);
      console.log(`Config data fetched for objectId ${objectId}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching config data for objectId ${objectId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch currency configuration
   * @returns {Promise<Object>} Currency config
   */
  async getCurrencyConfiguration() {
    try {
      const timestamp = Date.now();
      const endpoint = `${this.baseUrl}/dao/appsservlet?a=getCurrencyConfigurationData&_=${timestamp}&b=1`;
      const data = await this.get(endpoint, {});
      console.log('Currency configuration fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching currency configuration:', error);
      throw error;
    }
  }
}

const configApiService = new ConfigApiService();

export const getConfigData = (objectId) =>
  configApiService.getConfigData(objectId);

export const getCurrencyConfiguration = () =>
  configApiService.getCurrencyConfiguration();

export default configApiService;

