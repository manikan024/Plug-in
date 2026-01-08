import BaseApiService from './base-api-service';
import { API_CONSTANTS } from './api-constants';
import { OBJECT_IDS } from './object-constants';

/**
 * CustomerApiService - Handles customer-related API calls
 * Matches React-plugin CustomerApiService pattern
 */
class CustomerApiService extends BaseApiService {
  constructor() {
    super('customers');
  }

  /**
   * Fetch all customers (for list view)
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} Customers list with pagination
   */
  async getAllCustomers(options = {}) {
    try {
      const startIndex = parseInt(
        options.iDisplayStart || options.startIndex || 0,
        10
      );
      const numRecords = parseInt(options.numRecords || 30, 10);

      const params = {
        a: 'getAll',
        iDisplayLength: String(numRecords),
        iDisplayStart: String(startIndex),
        numRecords: String(numRecords),
        objectId: OBJECT_IDS.CUSTOMERS,
        sSortDir_0: 'asc',
        sortColumn: 'customerName.sortable',
        sortColumnType: '',
        sortDir: 'asc',
        startIndex: String(startIndex),
        t: String(options.t || Date.now()),
      };

      const data = await this.get(API_CONSTANTS.Customers.GET_ALL, params);
      const customers = this.extractData(data);
      const countOfRecords = data.countOfRecords || 0;

      const mappedCustomers = customers.map((customer) => {
        const customerId =
          customer.customerId?.toString() || customer.id?.toString() || '';
        const displayName = customer.customerName || 'Unknown Customer';

        return {
          id: customerId,
          customerId: customerId,
          subject: displayName,
          description: customer.description || '',
          customerName: displayName,
          ...customer, // Include all original customer data
        };
      });

      return {
        data: mappedCustomers,
        countOfRecords: countOfRecords,
        hasMore: startIndex + mappedCustomers.length < countOfRecords,
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async searchCustomers(searchText = '', options = {}) {
    try {
      const isSearchActive = searchText && searchText.length > 0;
      const endpoint = isSearchActive
        ? API_CONSTANTS.Customers.SEARCH_BY_TEXT
        : API_CONSTANTS.Customers.GET_ALL;

      const startIndex = parseInt(
        options.iDisplayStart || options.startIndex || 0,
        10
      );
      const numRecords = parseInt(options.numRecords || 30, 10);

      const params = {
        a: 'getAllBySearchText',
        iDisplayLength: String(startIndex > 0 ? startIndex : numRecords),
        iDisplayStart: String(startIndex),
        numRecords: String(numRecords),
        objectId: OBJECT_IDS.CUSTOMERS,
        sSortDir_0: 'asc',
        searchText: searchText || '',
        sortColumn: isSearchActive ? '' : 'customerName.sortable',
        sortColumnType: '',
        sortDir: 'asc',
        startIndex: String(startIndex),
        t: String(options.t || Date.now()),
      };

      const data = await this.get(endpoint, params);
      const customers = this.extractData(data);
      const countOfRecords = data.countOfRecords || 0;

      const mappedCustomers = customers.map((customer) => {
        const customerId =
          customer.customerId?.toString() || customer.id?.toString() || '';
        const displayName = customer.customerName || 'Unknown Customer';

        return {
          value: customerId,
          label: displayName,
          avatar: this.getInitials(displayName),
          customer: customer,
        };
      });

      const currentStart = parseInt(
        options.iDisplayStart || options.startIndex || 0,
        10
      );
      const hasMore =
        countOfRecords > 0
          ? currentStart + mappedCustomers.length < countOfRecords
          : mappedCustomers.length === 30;

      return {
        data: mappedCustomers,
        countOfRecords: countOfRecords,
        hasMore: mappedCustomers.length > 0 ? hasMore : false,
      };
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }
}

const customerApiService = new CustomerApiService();

export const searchCustomers = (searchText, options) =>
  customerApiService.searchCustomers(searchText, options);

export const getAllCustomers = (options) =>
  customerApiService.getAllCustomers(options);

export default customerApiService;

