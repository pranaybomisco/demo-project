import { HTTP_STATUS } from '../constants/index.js';

export const sendSuccess = (res, data = null, message = null, statusCode = HTTP_STATUS.OK, meta = null) => {
  const req = res.req;
  const serverDurationMs = req?._startTime ? Date.now() - req._startTime : 0;
  
  if (serverDurationMs !== undefined) {
    res.setHeader('X-Response-Time', `${serverDurationMs}ms`);
  }

  const enrichedMeta = {
    ...(meta || {}),
    serverResponseTimeMs: serverDurationMs,
  };

  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    ...(data !== null && { data }),
    meta: enrichedMeta,
  });
};

export const sendCreated = (res, data, message) => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

export const sendNoContent = (res) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};
