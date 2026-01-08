import BaseApiService from './base-api-service';
import { API_CONSTANTS } from './api-constants';
import { OBJECT_IDS } from './object-constants';

/**
 * AdvancedSearchApiService - Handles advanced search operations
 * Matches React-plugin AdvancedSearchApiService pattern
 */
class AdvancedSearchApiService extends BaseApiService {
  constructor() {
    super('common');
  }

  /**
   * Perform advanced search
   * @param {Object} searchCriteria - Search criteria from AdvancedSearchRenderer
   * @param {number} objectId - Object ID
   * @param {Object} options - Search options (pagination, etc.)
   * @returns {Promise<Object>} Search results
   */
  async advancedSearch(searchCriteria, objectId, options = {}) {
    try {
      let endpoint = '';
      
      // Determine endpoint based on objectId
      switch (objectId) {
        case OBJECT_IDS.CONTACTS:
          endpoint = API_CONSTANTS.AdvancedSearch?.CONTACTS || `${this.baseUrl}/dao/v6/contacts?a=getAllByAdvancedSearch`;
          break;
        case OBJECT_IDS.CUSTOMERS:
          endpoint = API_CONSTANTS.AdvancedSearch?.CUSTOMERS || `${this.baseUrl}/dao/v6/customers?a=getAllByAdvancedSearch`;
          break;
        case OBJECT_IDS.TICKETS:
          endpoint = API_CONSTANTS.AdvancedSearch?.CASES || `${this.baseUrl}/dao/v6/cases?a=getAllByAdvancedSearch`;
          break;
        default:
          endpoint = `${this.baseUrl}/dao/v6/common?a=getAllByAdvancedSearch`;
      }

      const startIndex = parseInt(options.startIndex || 0, 10);
      const numRecords = parseInt(options.numRecords || 30, 10);

      const params = {
        objectId: objectId,
        iDisplayStart: String(startIndex),
        iDisplayLength: String(numRecords),
        numRecords: String(numRecords),
        startIndex: String(startIndex),
        t: String(options.t || Date.now()),
        // Add search criteria
        ...this.buildSearchParams(searchCriteria),
      };

      const data = await this.post(endpoint, searchCriteria, params);
      const results = this.extractData(data);
      const countOfRecords = data.countOfRecords || 0;

      return {
        data: results,
        countOfRecords: countOfRecords,
        hasMore: startIndex + results.length < countOfRecords,
      };
    } catch (error) {
      console.error('Error performing advanced search:', error);
      throw error;
    }
  }

  /**
   * Build search parameters from criteria
   */
  buildSearchParams(searchCriteria) {
    const params = {};
    
    // Convert search criteria to API parameters
    if (searchCriteria.criteria && Array.isArray(searchCriteria.criteria)) {
      searchCriteria.criteria.forEach((criterion, index) => {
        params[`criteria[${index}].attributeId`] = criterion.attributeId || '';
        params[`criteria[${index}].operator`] = criterion.operator || '';
        params[`criteria[${index}].value`] = criterion.value || '';
      });
    }

    return params;
  }
}

const advancedSearchApiService = new AdvancedSearchApiService();

export const performAdvancedSearch = (searchCriteria, objectId, options) =>
  advancedSearchApiService.advancedSearch(searchCriteria, objectId, options);

export default advancedSearchApiService;

