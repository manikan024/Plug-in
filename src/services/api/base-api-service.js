import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

/**
 * BaseApiService - Base class for all API services
 * Matches React-plugin BaseApiService pattern
 */
class BaseApiService {
  constructor(endpoint = '') {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.endpoint = endpoint;
    this.sessionKey = API_CONFIG.sessionKey;
  }

  getAuthParams() {
    return {
      sessionKey: this.sessionKey,
    };
  }

  handleError(error, context = 'API request') {
    console.error(`Error in ${context}:`, error);

    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `API error: ${error.response.status} ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw error;
    }
  }

  async get(url = '', params = {}, options = {}) {
    try {
      const queryParams = new URLSearchParams({
        ...this.getAuthParams(),
        ...params,
      });

      const requestUrl = `${url}&${queryParams.toString()}`;
      
      console.log(`${this.constructor.name} GET Request:`, {
        requestUrl,
        method: 'GET',
        params,
      });

      const response = await axios.get(requestUrl, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          ...options.headers,
        },
        ...options,
      });

      console.log(`${this.constructor.name} GET Response:`, {
        hasData: !!response.data,
        dataLength: response.data?.data?.length || 0,
        countOfRecords: response.data?.countOfRecords,
      });

      return response.data;
    } catch (error) {
      this.handleError(error, `${this.constructor.name} GET`);
    }
  }

  async post(url = '', data = {}, params = {}, options = {}) {
    try {
      const queryParams = new URLSearchParams({
        ...this.getAuthParams(),
        ...params,
      });

      const requestUrl = `${url}&${queryParams.toString()}`;

      const isFormData = options.contentType === 'form';
      const requestData = isFormData ? new URLSearchParams(data) : data;

      console.log(`${this.constructor.name} POST Request:`, {
        requestUrl,
        method: 'POST',
        data: isFormData ? Object.fromEntries(requestData) : data,
      });

      const response = await axios.post(requestUrl, requestData, {
        headers: {
          'Content-Type': isFormData
            ? 'application/x-www-form-urlencoded'
            : 'application/json',
          Accept: 'application/json, text/plain, */*',
          ...options.headers,
        },
        ...options,
      });

      console.log(`${this.constructor.name} POST Response:`, {
        hasData: !!response.data,
        dataLength: response.data?.data?.length || 0,
        countOfRecords: response.data?.countOfRecords,
      });

      return response.data;
    } catch (error) {
      this.handleError(error, `${this.constructor.name} POST`);
    }
  }

  extractData(responseData) {
    if (responseData?.data && Array.isArray(responseData.data)) {
      return responseData.data;
    } else if (responseData?.documents && Array.isArray(responseData.documents)) {
      return responseData.documents;
    } else if (Array.isArray(responseData)) {
      return responseData;
    }
    return [];
  }

  getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}

export default BaseApiService;

