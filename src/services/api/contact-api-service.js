import BaseApiService from './base-api-service';
import { API_CONSTANTS } from './api-constants';
import { OBJECT_IDS } from './object-constants';

/**
 * ContactApiService - Handles contact-related API calls
 * Matches React-plugin ContactApiService pattern
 */
class ContactApiService extends BaseApiService {
  constructor() {
    super('contacts');
  }

  /**
   * Fetch all contacts (for list view)
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} Contacts list with pagination
   */
  async getAllContacts(options = {}) {
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
        objectId: OBJECT_IDS.CONTACTS,
        sSortDir_0: 'asc',
        sortColumn: 'lastName.sortable',
        sortColumnType: '',
        sortDir: 'asc',
        startIndex: String(startIndex),
        t: String(options.t || Date.now()),
      };

      const data = await this.get(API_CONSTANTS.Contacts.GET_ALL, params);
      const contacts = this.extractData(data);
      const countOfRecords = data.countOfRecords || 0;

      const mappedContacts = contacts.map((contact) => {
        const contactId =
          contact.contactId?.toString() || contact.id?.toString() || '';
        const displayName = contact.fullName || (contact.firstName + ' ' + contact.lastName) || 'Unknown Contact';

        return {
          id: contactId,
          contactId: contactId,
          subject: displayName,
          description: contact.jobTitle || contact.description || '',
          fullName: displayName,
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          jobTitle: contact.jobTitle || '',
          ...contact, // Include all original contact data
        };
      });

      return {
        data: mappedContacts,
        countOfRecords: countOfRecords,
        hasMore: startIndex + mappedContacts.length < countOfRecords,
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async searchContacts(searchText = '', options = {}) {
    try {
      const isSearchActive = searchText && searchText.length > 0;

      // Use getAllBySearchText for search, getAll for pagination
      const endpoint = isSearchActive
        ? API_CONSTANTS.Contacts.SEARCH_BY_TEXT
        : API_CONSTANTS.Contacts.GET_ALL;

      const startIndex = parseInt(
        options.iDisplayStart || options.startIndex || 0,
        10
      );
      const numRecords = parseInt(options.numRecords || 30, 10);

      // Build params
      const params = {
        a: 'getAllBySearchText',
        iDisplayLength: String(startIndex > 0 ? startIndex : numRecords),
        iDisplayStart: String(startIndex),
        numRecords: String(numRecords),
        objectId: OBJECT_IDS.CONTACTS,
        sSortDir_0: 'asc',
        searchText: searchText || '',
        sortColumn: isSearchActive ? '' : 'lastName.sortable',
        sortColumnType: '',
        sortDir: 'asc',
        startIndex: String(startIndex),
        t: String(options.t || Date.now()),
      };

      const data = await this.get(endpoint, params);
      const contacts = this.extractData(data);
      const countOfRecords = data.countOfRecords || 0;

      if (contacts.length === 0 && countOfRecords === 0) {
        console.info('No contacts found for search:', searchText);
        return {
          data: [],
          countOfRecords: 0,
          hasMore: false,
        };
      }

      const mappedContacts = contacts.map((contact) => {
        const contactId =
          contact.contactId?.toString() || contact.id?.toString() || '';
        const displayName = contact.fullName || 'Unknown Contact';

        return {
          value: contactId,
          label: displayName,
          avatar: this.getInitials(displayName),
          contact: contact,
        };
      });

      const currentStart = parseInt(
        options.iDisplayStart || options.startIndex || 0,
        10
      );
      const hasMore =
        countOfRecords > 0
          ? currentStart + mappedContacts.length < countOfRecords
          : mappedContacts.length === 30;

      return {
        data: mappedContacts,
        countOfRecords: countOfRecords,
        hasMore: mappedContacts.length > 0 ? hasMore : false,
      };
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }
  }

  async getContactById(contactId) {
    try {
      const params = {
        objectId: OBJECT_IDS.CONTACTS,
        contactId: contactId,
      };

      const data = await this.get(API_CONSTANTS.Contacts.GET_BY_ID, params);
      return data;
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      throw error;
    }
  }

  async saveContact(contactData) {
    try {
      const params = {
        objectId: OBJECT_IDS.CONTACTS,
      };

      const data = await this.post(
        API_CONSTANTS.Contacts.SAVE,
        contactData,
        params,
        { contentType: 'form' }
      );
      return data;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  }
}

const contactApiService = new ContactApiService();

export const searchContacts = (searchText, options) =>
  contactApiService.searchContacts(searchText, options);

export const getAllContacts = (options) =>
  contactApiService.getAllContacts(options);

export const getContactById = (contactId) =>
  contactApiService.getContactById(contactId);

export const saveContact = (contactData) =>
  contactApiService.saveContact(contactData);

export default contactApiService;

