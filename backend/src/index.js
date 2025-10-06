// Main router for all Lambda handlers
import { handler as healthHandler } from './handlers/health.js';
import { handler as artworksHandler } from './handlers/artworks.js';
import { handler as exhibitionsHandler } from './handlers/exhibitions.js';
import { handler as contactHandler } from './handlers/contact.js';
import { handler as uploadHandler } from './handlers/upload.js';
import { searchLocation } from './handlers/location.js';

export const handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const path = event.path || event.rawPath || '';
  const method = event.httpMethod || event.requestContext?.http?.method;

  try {
    // Route based on path
    if (path === '/health' || path === '/dev/health') {
      return await healthHandler(event, context);
    }

    if (path.startsWith('/artworks') || path.startsWith('/dev/artworks')) {
      return await artworksHandler(event, context);
    }

    if (path.startsWith('/exhibitions') || path.startsWith('/dev/exhibitions')) {
      return await exhibitionsHandler(event, context);
    }

    if (path === '/contact' || path === '/dev/contact') {
      return await contactHandler(event, context);
    }

    if (path === '/upload' || path === '/dev/upload') {
      return await uploadHandler(event, context);
    }

    if (path === '/locations/search' || path === '/dev/locations/search') {
      const query = event.queryStringParameters?.q || '';
      return await searchLocation(query);
    }

    // Not found
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Unhandled error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};