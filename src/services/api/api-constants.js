import { API_CONFIG } from '../../config/apiConfig';

const { BASE_URL } = API_CONFIG;

// API Constants - Matches React-plugin pattern
export const API_CONSTANTS = {
  Contacts: {
    GET_ALL: `${BASE_URL}/dao/v6/contacts?a=getAll`,
    SEARCH_BY_TEXT: `${BASE_URL}/dao/v6/contacts?a=getAllBySearchText`,
    GET_BY_ID: `${BASE_URL}/dao/v6/contacts?a=getById`,
    SAVE: `${BASE_URL}/dao/v6/contacts?a=save`,
  },
  Customers: {
    GET_ALL: `${BASE_URL}/dao/v6/customers?a=getAll`,
    SEARCH_BY_TEXT: `${BASE_URL}/dao/v6/customers?a=getAllBySearchText`,
    GET_BY_ID: `${BASE_URL}/dao/v6/customers?a=getById`,
    SAVE: `${BASE_URL}/dao/v6/customers?a=save`,
  },
  Tickets: {
    GET_ALL: `${BASE_URL}/dao/v6/cases?a=getAll`,
    SEARCH_BY_TEXT: `${BASE_URL}/dao/v6/cases?a=getAllBySearchText`,
    GET_BY_ID: `${BASE_URL}/dao/v6/cases?a=getById`,
    SAVE: `${BASE_URL}/dao/v6/cases?a=save`,
  },
  Common: {
    GET_CONFIG_DATA: `${BASE_URL}/dao/v6/common?a=getConfigData`,
    GET_METADATA: `${BASE_URL}/dao/v6/common?a=getMetadata`,
  },
  AdvancedSearch: {
    CONTACTS: `${BASE_URL}/dao/v6/contacts?a=getAllByAdvancedSearch`,
    CUSTOMERS: `${BASE_URL}/dao/v6/customers?a=getAllByAdvancedSearch`,
    CASES: `${BASE_URL}/dao/v6/cases?a=getAllByAdvancedSearch`,
  },
};

