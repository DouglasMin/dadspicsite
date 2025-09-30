export const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify(body),
  };
};

export const success = (data) => createResponse(200, data);
export const created = (data) => createResponse(201, data);
export const noContent = () => ({ statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
export const badRequest = (message) => createResponse(400, { error: message });
export const notFound = (message) => createResponse(404, { error: message });
export const internalError = (message) => createResponse(500, { error: message || 'Internal server error' });