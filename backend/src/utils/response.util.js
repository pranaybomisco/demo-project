import { HTTP_STATUS } from '../constants/index.js';

export const sendSuccess = (res, data = null, message = null, statusCode = HTTP_STATUS.OK, meta = null) => {
  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    ...(data !== null && { data }),
    ...(meta && { meta }),
  });
};

export const sendCreated = (res, data, message) => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

export const sendNoContent = (res) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};
