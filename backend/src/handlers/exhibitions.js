import { randomUUID } from 'crypto';
import { dynamodb } from '../utils/dynamodb.js';
import { success, created, noContent, badRequest, notFound, internalError } from '../utils/response.js';

const EXHIBITIONS_TABLE = process.env.EXHIBITIONS_TABLE_NAME;

function isValidLink(link) {
  return /^https?:\/\//i.test(link);
}

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod, pathParameters, body } = event;
  const id = pathParameters?.id;

  try {
    switch (httpMethod) {
      case 'GET':
        if (id) {
          return await getExhibition(id);
        }
        return await listExhibitions();

      case 'POST':
        return await createExhibition(body);

      case 'PUT':
        if (!id) return badRequest('Exhibition ID is required');
        return await updateExhibition(id, body);

      case 'DELETE':
        if (!id) return badRequest('Exhibition ID is required');
        return await deleteExhibition(id);

      default:
        return badRequest('Unsupported HTTP method');
    }
  } catch (error) {
    console.error('Error:', error);
    return internalError(error.message);
  }
};

async function listExhibitions() {
  const exhibitions = await dynamodb.scan(EXHIBITIONS_TABLE);
  return success(exhibitions);
}

async function getExhibition(id) {
  const exhibition = await dynamodb.get(EXHIBITIONS_TABLE, { id });

  if (!exhibition) {
    return notFound('Exhibition not found');
  }

  return success(exhibition);
}

async function createExhibition(bodyString) {
  const data = JSON.parse(bodyString);

  // Validate required fields
  if (!data.title || !data.description || !data.startDate || !data.endDate || !data.location) {
    return badRequest('Missing required fields: title, description, startDate, endDate, location');
  }

  if (data.relatedLink && !isValidLink(data.relatedLink)) {
    return badRequest('relatedLink must start with http:// or https://');
  }

  const now = new Date().toISOString();
  const exhibition = {
    id: randomUUID(),
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    location: data.location,
    imageUrl: data.imageUrl || '',
    relatedLink: data.relatedLink || '',
    photoUrls: data.photoUrls || [],
    artworkIds: data.artworkIds || [],
    createdAt: now,
    updatedAt: now,
  };

  await dynamodb.put(EXHIBITIONS_TABLE, exhibition);
  return created(exhibition);
}

async function updateExhibition(id, bodyString) {
  const data = JSON.parse(bodyString);

  // Check if exhibition exists
  const existing = await dynamodb.get(EXHIBITIONS_TABLE, { id });
  if (!existing) {
    return notFound('Exhibition not found');
  }

  if (data.relatedLink && !isValidLink(data.relatedLink)) {
    return badRequest('relatedLink must start with http:// or https://');
  }

  // Build updates object
  const updates = {
    updatedAt: new Date().toISOString(),
  };

  const allowedFields = ['title', 'description', 'startDate', 'endDate', 'location', 'imageUrl', 'relatedLink', 'photoUrls', 'artworkIds'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const updated = await dynamodb.update(EXHIBITIONS_TABLE, { id }, updates);
  return success(updated);
}

async function deleteExhibition(id) {
  // Check if exhibition exists
  const existing = await dynamodb.get(EXHIBITIONS_TABLE, { id });
  if (!existing) {
    return notFound('Exhibition not found');
  }

  await dynamodb.delete(EXHIBITIONS_TABLE, { id });
  return noContent();
}