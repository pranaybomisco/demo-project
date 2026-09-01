import { UI_MESSAGES, ERROR_CODES } from '../constants/index.js';

export const handleApiError = (error) => {
  if (error.response) {
    const errorData = error.response.data?.error;
    return {
      code: errorData?.code || ERROR_CODES.API_ERROR,
      message: errorData?.message || error.response.statusText || UI_MESSAGES.AUTH_ERROR_GENERIC,
      details: errorData?.details || null,
      status: error.response.status,
    };
  }

  if (error.request) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: UI_MESSAGES.NETWORK_ERROR,
      status: 0,
    };
  }

  return {
    code: ERROR_CODES.CLIENT_ERROR,
    message: error.message || UI_MESSAGES.AUTH_ERROR_GENERIC,
    status: 500,
  };
};

